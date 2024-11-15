from fastapi import Depends, HTTPException,APIRouter
from typing import Annotated
from models import ActaCompactacion, ActaCompactacionCreate, Deposito, Persona, Vehiculo, ActaCompactacionResponse
from database import SessionLocal
from sqlalchemy.orm import Session, joinedload
from starlette import status
from .auth import get_current_user

router = APIRouter(
    prefix='/actas',
    tags=['actas']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/", status_code=status.HTTP_200_OK)
def traer_actas(user:user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Autenticación fallida')
    return db.query(ActaCompactacion).all()

@router.get("/{acta_id}", response_model=ActaCompactacionResponse, status_code=status.HTTP_200_OK)
def obtener_acta_compactacion(acta_id: int, db: Session = Depends(get_db)):
    acta = (
        db.query(ActaCompactacion)
        .options(
            joinedload(ActaCompactacion.deposito),
            joinedload(ActaCompactacion.testigo),
            joinedload(ActaCompactacion.responsable_dao),
            joinedload(ActaCompactacion.responsable_policial),
            joinedload(ActaCompactacion.vehiculos),
        )
        .filter(ActaCompactacion.id == acta_id)
        .first()
    )
    
    if not acta:
        raise HTTPException(status_code=404, detail="Acta de compactación no encontrada")
    
    return acta

@router.post("/crear/", response_model=ActaCompactacionCreate, status_code=status.HTTP_201_CREATED)
def crear_acta_compactacion(
    acta_data: ActaCompactacionCreate, db: Session = Depends(get_db)
):
    # Verificar existencia del depósito
    deposito = db.query(Deposito).filter(Deposito.id == acta_data.deposito_id).first()
    if not deposito:
        raise HTTPException(status_code=404, detail="Depósito no encontrado")

    # Verificar existencia de las personas (testigo, responsable DAO, responsable policial)
    testigo = db.query(Persona).filter(Persona.id == acta_data.testigo_id).first()
    responsable_dao = db.query(Persona).filter(Persona.id == acta_data.responsable_dao_id).first()
    responsable_policial = db.query(Persona).filter(Persona.id == acta_data.responsable_policial_id).first()
    
    if not testigo or not responsable_dao or not responsable_policial:
        raise HTTPException(status_code=404, detail="Una o más personas especificadas no existen")

    # Verificar que la lista de vehículos no esté vacía
    if not acta_data.vehiculos:
        raise HTTPException(status_code=400, detail="La lista de vehículos no puede estar vacía")
    
    dominios = [vehiculo.dominio for vehiculo in acta_data.vehiculos]

    vehiculos_existentes = db.query(Vehiculo).filter(Vehiculo.dominio.in_(dominios)).all()
    if vehiculos_existentes:
        raise HTTPException(status_code=400, detail="Uno o más vehículos ya están asociados a otra acta")

    nueva_acta = ActaCompactacion(
        fecha=acta_data.fecha,
        lugar=acta_data.lugar,
        deposito_id=acta_data.deposito_id,
        testigo_id=acta_data.testigo_id,
        responsable_dao_id=acta_data.responsable_dao_id,
        responsable_policial_id=acta_data.responsable_policial_id,
    )
    
    db.add(nueva_acta)
    db.flush()

    for vehiculo_data in acta_data.vehiculos:
        nuevo_vehiculo = Vehiculo(**vehiculo_data.dict(),
            acta_compactacion_id=nueva_acta.id 
        )
        db.add(nuevo_vehiculo)

    db.commit()
    db.refresh(nueva_acta)
    return nueva_acta