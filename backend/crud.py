from sqlalchemy.orm import Session
from models import News, Analysis, Best, Vessel, Cargo, Catcher, Offers, Requests
from schemas import (NewsItem, AnalysisItem, BestItem, 
                     CatcherItem, VesselItem, CargoItem,
                       OffersItem, RequestsItem)
from fastapi import  HTTPException

def get_news(db: Session, skip: int = 0, limit: int = 10):
    """
    Получение новостей.
    """
    return db.query(News).order_by(News.date.desc()).offset(skip).limit(limit).all()

def create_news(db: Session, news_item: NewsItem):
    """
    Добавление новости.
    """
    db_news = News(
        title=news_item.title,
        content=news_item.content,
        image_url=news_item.image_url
    )
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news

def get_analysis(db: Session, skip: int = 0, limit: int = 10):
    """
    Получение анализа.
    """
    return db.query(Analysis).order_by(Analysis.date.desc()).offset(skip).limit(limit).all()

def create_analysis(db: Session, analysis_item: AnalysisItem):
    """
    Добавление анализа.
    """
    db_analysis = Analysis(
        title=analysis_item.title,
        content=analysis_item.content,
        image_url=analysis_item.image_url
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis

def get_best(db: Session, skip: int = 0, limit: int = 10):
    """
    Получение лучших предложений.
    """
    return db.query(Best).order_by(Best.date.desc()).offset(skip).limit(limit).all()

def create_best(db: Session, best_item: BestItem):
    """
    Добавление предложения.
    """
    db_best = Best(
        title=best_item.title,
        description=best_item.description,
        price=best_item.price,
        image_url=best_item.image_url,
        author=best_item.author,
        
    )
    db.add(db_best)
    db.commit()
    db.refresh(db_best)
    return db_best


def create_catcher(db: Session, catcher: CatcherItem):
    """
    Создание ловца новостей.
    """
    print("Data received in create_catcher:", catcher.dict())
    db_news = Catcher(
        title=catcher.title,
        description=catcher.description,
        image_url=catcher.image_url)
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news

def create_vessel(db: Session, vessel: VesselItem):
    """
    Добавление судна.
    """
    print("Received data:", vessel.dict())  # Логирование
    db_vessel = Vessel(
        dwt=vessel.dwt,
        blt=vessel.blt,
        flag=vessel.flag,
        open_at=vessel.open_at,
        availability=vessel.availability,
        status=vessel.status
    )
    db.add(db_vessel)
    db.commit()
    db.refresh(db_vessel)
    return db_vessel

def create_cargo(db: Session, cargo: CargoItem):
    """
    Добавление груза.
    """
    print("Received data:", cargo.dict())  # Логирование
    db_cargo = Cargo(
        date_at=cargo.date_at,
        cargo=cargo.cargo,
        quantity=cargo.quantity,
        port_loading=cargo.port_loading,
        port_discharge=cargo.port_discharge,
        rates=cargo.rates,
        laycan=cargo.laycan,
        status=cargo.status
    )
    db.add(db_cargo)
    db.commit()
    db.refresh(db_cargo)
    return db_cargo

def get_catcher(db: Session, skip: int = 0, limit: int = 10):
    """
    Получение ловцов новостей.
    """
    return db.query(Catcher).order_by(Catcher.date.desc()).offset(skip).limit(limit).all()

def get_vessel(db: Session, skip: int = 0, limit: int = 10):
    """
    Получение судов.
    """
    return db.query(Vessel).order_by(Vessel.date.desc()).offset(skip).limit(limit).all()

def get_cargo(db: Session, skip: int = 0, limit: int = 10):
    """
    Получение грузов.
    """
    return db.query(Cargo).order_by(Cargo.date.desc()).offset(skip).limit(limit).all()

def create_offers(db: Session, offers: OffersItem):
    """
    Добавление предложения.
    """
    db_offers = Offers(
        crop_name=offers.crop_name or "",
        quantity=offers.quantity or "",
        port=offers.port or "",
        shipment_period=offers.shipment_period or "",
        seller=offers.seller or "",
        bayer=offers.bayer or "",
        second_tag=offers.second_tag or "",
        country=offers.country or "",
        author=offers.author or "",
        image_url=offers.image_url or ""
    )
    db.add(db_offers)
    db.commit()
    db.refresh(db_offers)
    return db_offers

def create_requests(db: Session, requests: RequestsItem):
    """
    Добавление запроса.
    """
    db_requests = Requests(crop_name=requests.crop_name,
        quantity=requests.quantity,
        port=requests.port,
        shipment_period=requests.shipment_period,
        seller=requests.seller,
        bayer=requests.bayer,
        second_tag=requests.second_tag,
        country=requests.country,
        author=requests.author,
        image_url=requests.image_url)
    db.add(db_requests)
    db.commit()
    db.refresh(db_requests)
    return db_requests

def get_offers(db: Session, skip: int = 0):
    """
    Получение предложений.
    """
    return db.query(Offers).order_by(Offers.date.desc()).offset(skip).all()

def get_requests(db: Session, skip: int = 0):
    """
    Получение запросов.
    """
    return db.query(Requests).order_by(Requests.date.desc()).offset(skip).all()


# Получить предложения со статусом 'pending' (для Vessel и Cargo)
def get_pending_vessel(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Vessel).filter(Vessel.status == "pending").offset(skip).limit(limit).all()

def get_pending_cargo(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Cargo).filter(Cargo.status == "pending").offset(skip).limit(limit).all()

# Обновление статуса Vessel
def update_vessel_status(db: Session, vessel_id: int, new_status: str):
    vessel = db.query(Vessel).filter(Vessel.id == vessel_id).first()
    if vessel:
        vessel.status = new_status
        db.commit()
        db.refresh(vessel)
        return vessel
    raise HTTPException(status_code=404, detail="Vessel not found")

# Обновление статуса Cargo
def update_cargo_status(db: Session, cargo_id: int, new_status: str):
    cargo = db.query(Cargo).filter(Cargo.id == cargo_id).first()
    if cargo:
        cargo.status = new_status
        db.commit()
        db.refresh(cargo)
        return cargo
    raise HTTPException(status_code=404, detail="Cargo not found")
