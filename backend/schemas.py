from pydantic import BaseModel, field_serializer
from typing import Optional
from datetime import datetime, timedelta

class NewsItem(BaseModel):
    id: Optional[int]
    title: str
    content: str
    image_url: str
    date: Optional[datetime]

    @field_serializer("date")
    def serialize_date(self, value: Optional[datetime]) -> Optional[str]:
        if value:
            adjusted_value = value + timedelta(hours=3)
            return adjusted_value.strftime("%d.%m.%Y %H:%M")
        return None

    class Config:
        from_attributes  = True

class NewsAddItem(BaseModel):
    title: str
    content: str
    image_url: str


class AnalysisItem(BaseModel):
    id: Optional[int]
    title: str
    content: str
    image_url: str
    date: Optional[datetime]

    @field_serializer("date")
    def serialize_date(self, value: Optional[datetime]) -> Optional[str]:
        if value:
            adjusted_value = value + timedelta(hours=3)
            return adjusted_value.strftime("%d.%m.%Y %H:%M")
        return None

    class Config:
        from_attributes  = True

class AnalysisAddItem(BaseModel):
    title: str
    content: str
    image_url: str

class BestItem(BaseModel):
    id: Optional[int]
    title: str
    description: str
    price: float  # Keep price as float for compatibility with the database
    image_url: str
    author: str
    date: Optional[datetime]

    @field_serializer("date")
    def serialize_date(self, value: Optional[datetime]) -> Optional[str]:
        if value:
            adjusted_value = value + timedelta(hours=3)
            return adjusted_value.strftime("%d.%m.%Y %H:%M")
        return None

    @field_serializer("price")
    def serialize_price(self, value: float) -> str:
        return f"{value:.2f}"  # Format price as a string with 2 decimal places

    class Config:
        from_attributes = True

class BestAddItem(BaseModel):
    title: str
    description: str
    price: float
    image_url: str
    author: str
    

class Quote(BaseModel):
    symbol: str
    price: float

class CatcherItem(BaseModel):
    id: Optional[int]
    title: str
    description: str
    image_url: str
    date: Optional[datetime]

    @field_serializer("date")
    def serialize_date(self, value: Optional[datetime]) -> Optional[str]:
        if value:
            adjusted_value = value + timedelta(hours=3)
            return adjusted_value.strftime("%d.%m.%Y %H:%M")
        return None

    class Config:
        from_attributes  = True

class CatcherAddItem(BaseModel):
    title: str
    description: str
    image_url: str
    
    

class VesselItem(BaseModel):
    id: Optional[int]
    dwt: str
    blt: str
    flag: str
    open_at: str
    availability: str
    status:str
    date: Optional[datetime] 

    @field_serializer("date")
    def serialize_date(self, value: Optional[datetime]) -> Optional[str]:
        if value:
            adjusted_value = value + timedelta(hours=3)
            return adjusted_value.strftime("%d.%m.%Y %H:%M")
        return None

    class Config:
        from_attributes  = True

class VesselAddItem(BaseModel):
    dwt: str
    blt: str
    flag: str
    open_at: str
    availability: str
    status:str="pending"

class CargoItem(BaseModel):
    id: Optional[int]
    date_at:str
    cargo: str
    quantity: str
    port_loading: str
    port_discharge: str
    rates: str
    laycan: str
    status:str
    date: Optional[datetime] = None

    @field_serializer("date")
    def serialize_date(self, value: Optional[datetime]) -> Optional[str]:
        if value:
            adjusted_value = value + timedelta(hours=3)
            return adjusted_value.strftime("%d.%m.%Y %H:%M")
        return None

    class Config:
        from_attributes  = True

class CargoAddItem(BaseModel):
    date_at:str
    cargo: str
    quantity: str
    port_loading: str
    port_discharge: str
    rates: str
    laycan: str
    status:str="pending"

class OffersItem(BaseModel):
    id: Optional[int]
    crop_name: str
    quantity: str
    port: str
    shipment_period: str
    seller: Optional[str]= None
    bayer: Optional[str]= None
    second_tag: str
    country: str
    author: str
    image_url: str
    date: Optional[datetime]

    @field_serializer("date")
    def serialize_date(self, value: Optional[datetime]) -> Optional[str]:
        if value:
            adjusted_value = value + timedelta(hours=3)
            return adjusted_value.strftime("%d.%m.%Y %H:%M")
        return None

    class Config:
        from_attributes  = True

class OffersAddItem(BaseModel):
    crop_name: str
    quantity: str
    port: str
    shipment_period: str
    seller: Optional[str]= None
    bayer: Optional[str]= None
    second_tag: str
    country: str
    author: str
    image_url: str

class RequestsItem(BaseModel):
    id: Optional[int]
    crop_name: str
    quantity: str
    port: str
    shipment_period: str
    seller: Optional[str]= None
    bayer: Optional[str]= None
    second_tag: str
    country: str
    author: str
    image_url: str
    date: Optional[datetime]

    @field_serializer("date")
    def serialize_date(self, value: Optional[datetime]) -> Optional[str]:
        if value:
            adjusted_value = value + timedelta(hours=3)
            return adjusted_value.strftime("%d.%m.%Y %H:%M")
        return None

    class Config:
        from_attributes  = True
    
class RequestsAddItem(BaseModel):
    crop_name: str
    quantity: str
    port: str
    shipment_period: str
    seller: Optional[str]= None
    bayer: Optional[str]= None
    second_tag: str
    country: str
    author: str
    image_url: str


