from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Enum
from database import Base
from datetime import datetime

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    image_url = Column(String)
    date = Column(DateTime, default=datetime.utcnow, nullable=False)
   
class Analysis(Base):
    __tablename__ = "analysis"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    image_url = Column(String)
    date = Column(DateTime, default=datetime.utcnow, nullable=False)
    

class Best(Base):
    __tablename__ = "best"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    image_url = Column(String)
    author = Column(String)
    date = Column(DateTime, default=datetime.utcnow, nullable=False)


class Catcher(Base):
    __tablename__ = "catcher"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow, nullable=False)
    

class Vessel(Base):
    __tablename__ = "vessel"

    id = Column(Integer, primary_key=True, index=True)
    dwt = Column(String, nullable=False)
    blt = Column(String, nullable=False)
    flag = Column(String, nullable=True)
    open_at = Column(String, nullable=True)
    availability = Column(String, nullable=False)
    status = Column(Enum("pending", "approved", "rejected", name="vessel_status"), default="pending")
    date = Column(DateTime, default=datetime.utcnow, nullable=False)

class Cargo(Base):
    __tablename__ = "cargo"

    id = Column(Integer, primary_key=True, index=True)
    date_at = Column(String, nullable=False)
    cargo = Column(String, nullable=False)
    quantity = Column(String, nullable=False)
    port_loading = Column(String, nullable=False)
    port_discharge = Column(String, nullable=False)
    rates = Column(String, nullable=False)
    laycan = Column(String, nullable=False)
    status = Column(Enum("pending", "approved", "rejected", name="cargo_status"), default="pending")
    date = Column(DateTime, default=datetime.utcnow, nullable=False)

class Offers(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String, nullable=True)
    quantity = Column(String, nullable=True)
    port = Column(String, nullable=True)
    shipment_period = Column(String, nullable=True)
    seller = Column(String, nullable=True)
    bayer= Column(String, nullable=True)
    second_tag = Column(String, nullable=True)
    country = Column(String, nullable=True)
    author = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow, nullable=False)

class Requests(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String, nullable=False)
    quantity = Column(String, nullable=False)
    port = Column(String, nullable=False)
    shipment_period = Column(String, nullable=False)
    seller = Column(String, nullable=True)
    bayer= Column(String, nullable=True)
    second_tag = Column(String, nullable=False)
    country = Column(String, nullable=False)
    author = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    date = Column(DateTime, default=datetime.utcnow, nullable=False)