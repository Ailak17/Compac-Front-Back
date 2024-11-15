from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

# SQLAlchemy models

class Persona(Base):
    __tablename__ = 'persona'
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    apellido = Column(String(255), nullable=False)
    dni = Column(String(20), nullable=False, unique=True)

    testigo_actas = relationship("ActaCompactacion", back_populates="testigo", foreign_keys='ActaCompactacion.testigo_id')
    responsable_dao_actas = relationship("ActaCompactacion", back_populates="responsable_dao", foreign_keys='ActaCompactacion.responsable_dao_id')
    responsable_policial_actas = relationship("ActaCompactacion", back_populates="responsable_policial", foreign_keys='ActaCompactacion.responsable_policial_id')


class Deposito(Base):
    __tablename__ = 'deposito'
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    direccion = Column(String(255), nullable=False)

    actas = relationship("ActaCompactacion", back_populates="deposito")


class ActaCompactacion(Base):
    __tablename__ = 'acta_compactacion'
    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(Date, nullable=False)
    lugar = Column(String(255), nullable=False)
    deposito_id = Column(Integer, ForeignKey("deposito.id"))
    testigo_id = Column(Integer, ForeignKey("persona.id"))
    responsable_dao_id = Column(Integer, ForeignKey("persona.id"))
    responsable_policial_id = Column(Integer, ForeignKey("persona.id"))

    deposito = relationship("Deposito", back_populates="actas")
    testigo = relationship("Persona", back_populates="testigo_actas", foreign_keys=[testigo_id])
    responsable_dao = relationship("Persona", back_populates="responsable_dao_actas", foreign_keys=[responsable_dao_id])
    responsable_policial = relationship("Persona", back_populates="responsable_policial_actas", foreign_keys=[responsable_policial_id])
    vehiculos = relationship("Vehiculo", back_populates="acta_compactacion")


class Vehiculo(Base):
    __tablename__ = 'vehiculo'
    id = Column(Integer, primary_key=True, index=True)
    nro_ruvs = Column(String(50))
    nro_cargo_policial = Column(String(50))
    dominio = Column(String(10), nullable=False, unique=True)
    chasis_cuadro = Column(String(50))
    motor = Column(String(50))
    dependencia_policial = Column(String(255))
    marca = Column(String(50))
    modelo = Column(String(50))
    tipo = Column(String(50))
    acta_compactacion_id = Column(Integer, ForeignKey("acta_compactacion.id"))
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_modificacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    usuario_creacion = Column(String(255))
    usuario_modificacion = Column(String(255))

    acta_compactacion = relationship("ActaCompactacion", back_populates="vehiculos")

class Users(Base):
    __tablename__='users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(50), unique=True)
    username = Column(String(20), unique=True)
    first_name= Column(String(50))
    last_name=Column(String(50))
    telefono=Column(String(50))
    hashed_password=Column(String(100))
    is_active=Column(Boolean, default=True)
    role=Column(String(50))


# Pydantic models

class PersonaBase(BaseModel):
    nombre: str
    apellido: str
    dni: str


class PersonaCreate(PersonaBase):
    pass


class PersonaResponse(PersonaBase):
    id: int
    class Config:
        from_attributes = True


class DepositoBase(BaseModel):
    nombre: str
    direccion: str


class DepositoCreate(DepositoBase):
    pass


class DepositoResponse(DepositoBase):
    id: int
    class Config:
        from_attributes = True

class VehiculoBase(BaseModel):
    nro_ruvs: Optional[str]
    nro_cargo_policial: Optional[str]
    dominio: Optional[str]
    chasis_cuadro: Optional[str]
    motor: Optional[str]
    dependencia_policial: Optional[str]
    marca: Optional[str]
    modelo: Optional[str]
    tipo: Optional[str]
    # acta_compactacion_id: Optional[int] = None
    # usuario_creacion: Optional[int] = None
    # usuario_modificacion: Optional[int] = None


class VehiculoCreate(VehiculoBase):
    pass


class VehiculoResponse(VehiculoBase):
    id: int
    fecha_creacion: datetime
    fecha_modificacion: datetime
    class Config:
        from_attributes = True

class ActaCompactacionBase(BaseModel):
    fecha: datetime
    lugar: str

    class Config:
        from_attributes = True


class ActaCompactacionCreate(ActaCompactacionBase):
    deposito_id: int
    testigo_id: int
    responsable_dao_id: int
    responsable_policial_id: int
    vehiculos: List[VehiculoCreate]

    class Config:
        from_attributes = True


class ActaCompactacionResponse(ActaCompactacionBase):
    id: int
    deposito: DepositoResponse
    testigo: PersonaResponse
    responsable_dao: PersonaResponse
    responsable_policial: PersonaResponse
    vehiculos: List[VehiculoCreate]

    class Config:
        from_attributes = True



