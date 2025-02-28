from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import   get_offers, get_requests, create_offers, create_requests
from schemas import OffersAddItem, RequestsAddItem, OffersItem,RequestsItem
from database import get_db
from typing import List

router = APIRouter()



@router.get("/offers", response_model=List[OffersItem])
def read_offers(skip: int = 0, db: Session = Depends(get_db)):
    return get_offers(db, skip=skip)


@router.post("/offers")
def add_offers(offers: OffersAddItem, db: Session = Depends(get_db)):
    print(f"Result: {offers}")
    return create_offers(db=db, offers=offers)


@router.get("/requests")
def read_requests(skip: int = 0, db: Session = Depends(get_db)):
    return get_requests(db, skip=skip)


@router.post("/requests")
def add_requests(requests: RequestsAddItem, db: Session = Depends(get_db)):
    return create_requests(db, requests)
