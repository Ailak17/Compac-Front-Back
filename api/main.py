from fastapi import FastAPI
from models import Base
from database import engine
from routers import vehiculos, auth, personas, depositos, actas
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Aquí puedes especificar los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],  # Puedes restringir los métodos permitidos (GET, POST, etc.)
    allow_headers=["*"],  # Puedes restringir los encabezados permitidos
)

Base.metadata.create_all(bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()

app.include_router(vehiculos.router)
app.include_router(personas.router)
app.include_router(depositos.router)
app.include_router(actas.router)
app.include_router(auth.router)