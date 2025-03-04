from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from crud import get_news, create_news, get_analysis, create_analysis, get_best, create_best
from schemas import NewsItem, AnalysisItem, BestItem, NewsAddItem, AnalysisAddItem, BestAddItem
from database import get_db
from .price import get_prices, get_chicago, get_maex, get_matif, convert_numpy_to_native
from fastapi.encoders import jsonable_encoder

from pathlib import Path



router = APIRouter()

# News endpoints
@router.get("/news", response_model=List[NewsItem])
def read_news(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    result=get_news(db, skip=skip, limit=limit)
    print(f"Result: {result}")
    return result

@router.post("/news", response_model=NewsAddItem)
def add_news(news_item: NewsAddItem, db: Session = Depends(get_db)):
    print("Received data:", news_item)  # Лог входящих данных
    return create_news(db=db, news_item=news_item)

# Analysis endpoints
@router.get("/analysis", response_model=List[AnalysisItem])
def read_analysis(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_analysis(db, skip=skip, limit=limit)

@router.post("/analysis", response_model=AnalysisAddItem)
def add_analysis(analysis_item: AnalysisAddItem, db: Session = Depends(get_db)):
    return create_analysis(db=db, analysis_item=analysis_item)

# Offers endpoints
@router.get("/best", response_model=List[BestItem])
def read_best(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_best(db, skip=skip, limit=limit)

@router.post("/best", response_model=BestAddItem)
def add_best(best_item: BestAddItem, db: Session = Depends(get_db)):
    print(f"Received Offer Data: {best_item}")  # Лог входящих данных
    return create_best(db=db, best_item=best_item)

@router.get("/quotes")
async def fetch_quotes():
    try:
        quotes = {}
        quotes.update(get_prices())
        quotes.update(get_chicago())
        quotes.update(get_maex())
        quotes.update(get_matif())
        quotes = convert_numpy_to_native(quotes)
        return {"quotes": jsonable_encoder(quotes)}
    except Exception as e:
        return {"error": str(e)}
    
