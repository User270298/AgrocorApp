from fastapi import  HTTPException, APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
import openai
import os

# Load environment variables
load_dotenv(dotenv_path='.env')
openai.api_key = os.getenv('OPENAI_API_KEY')
# Initialize router
router = APIRouter()
# print(openai.api_key)

def converted_file(file_path: str) -> str:
    # Определяем абсолютный путь к файлу относительно текущего файла
    absolute_path = os.path.join(os.path.dirname(__file__), file_path)
    
    # Проверяем, существует ли файл
    if not os.path.exists(absolute_path):
        raise FileNotFoundError(f"File not found: {absolute_path}")
    
    # Читаем содержимое файла
    with open(absolute_path, 'r', encoding='utf-8') as file:
        text = file.read()
    return text


# OpenAI request function
async def ask_openai(user_input: str) -> str:
    try:
        file_text = converted_file(r'input_text.txt')
        response = await openai.ChatCompletion.acreate(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": '''AGROCOR Contract Arbitration Assistant helps users manage a library of contracts and agreements related 
                to FOSFA, GAFTA, and SYNACOMEX.
                In each answer, be sure to add the following text and translate it according to the language of the question asked-
                If the question is asked in English:
                🤖 The BOT has a general advisory function.
                 For professional advice and assistance, you can always contact the AGROCOR team, Broker #1. 
                🤖 БОТ выполняет общую консультативную функцию.
                 За профессиональной консультацией и помощью вы всегда можете обратиться к команде AGROCOR, брокеру №1.   '''},
                {"role": "assistant", "content": f"Ответы на вопросы ищи здесь - {file_text}"},
                {"role": "user", "content": user_input},
            ],
            max_tokens=1500,
            temperature=0.4
        )
        reply = response['choices'][0]['message']['content'].strip()
        return reply
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error with OpenAI API: {str(e)}")

# Request model
class Question(BaseModel):
    question: str

@router.post("/ask")
async def handle_question(question: Question):
    """Endpoint to handle user questions."""
    user_input = question.question

    # Get response from OpenAI
    response = await ask_openai(user_input)
    return {"response": response}



