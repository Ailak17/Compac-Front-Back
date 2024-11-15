from fastapi import Depends, Path, HTTPException,APIRouter
from typing import Annotated
from models import Deposito, DepositoCreate
from database import SessionLocal
from sqlalchemy.orm import Session
from starlette import status
from .auth import get_current_user

router = APIRouter(
    prefix='/depositos',
    tags=['depositos']
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
def traer_depositos(user:user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Autenticación fallida')
    return db.query(Deposito).all()

@router.get("/{id_deposito}", status_code=status.HTTP_200_OK)
def traer_deposito(user:user_dependency, db: db_dependency, id_deposito: int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=401, detail='Autenticación fallida')
    deposito_model = db.query(Deposito).filter(Deposito.id==id_deposito).first()
    if deposito_model is not None:
        return deposito_model
    else:
        raise HTTPException(status_code=404, detail="No se encontró el depósito.")
    
@router.post("/crear/", status_code=status.HTTP_201_CREATED)
def crear_deposito(user:user_dependency, db: db_dependency,deposito_request:DepositoCreate):
    if user is None:
        raise HTTPException(status_code=401, detail='Autenticación fallida')
    deposito_model=Deposito(**deposito_request.dict())
    db.add(deposito_model)
    db.commit()

@router.put("/{deposito_id}", status_code=status.HTTP_204_NO_CONTENT)
def modificar_deposito(user:user_dependency, db: db_dependency, deposito_request:DepositoCreate, deposito_id: int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=401, detail='Autenticación fallida')
    deposito_model=db.query(Deposito).filter(Deposito.id==deposito_id).first()
    if deposito_model is None:
        raise HTTPException(status_code=404, detail="No se encontró el depósito.")
    
    deposito_model.nombre=deposito_request.nombre
    deposito_model.direccion=deposito_request.direccion
    db.commit()

@router.delete("/eliminar/{deposito_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_deposito(user:user_dependency, db:db_dependency,deposito_id:int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=401, detail='Autenticación fallida')
    deposito_model=db.query(Deposito).filter(Deposito.id==deposito_id).first()
    if deposito_model is None:
        raise HTTPException(status_code=404, detail="No se encontró el depósito")
    db.query(Deposito).filter(Deposito.id==deposito_id).delete()
    db.commit()