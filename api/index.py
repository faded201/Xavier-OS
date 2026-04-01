from fastapi import FastAPI
from prod_backend import app as main_app  # Import your backend

app = FastAPI()
app.mount("/api", main_app)  # Routes to /api/*

@app.get("/")
def root():
    return {"message": "Xavier OS ∞ Quinn Audiobook Live!"}

