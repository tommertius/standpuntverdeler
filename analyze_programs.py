#!/usr/bin/env python3
"""
Script om verkiezingsprogramma's te analyseren en standpunten per thema te extraheren
"""

import pdfplumber
import json
import re
from pathlib import Path

# Thema's en gerelateerde zoektermen
THEMES = {
    "wonen": [
        "woning", "woningbouw", "huur", "sociale huur", "koopwoning", 
        "hypotheek", "woningnood", "betaalbaar wonen", "huisvesting",
        "woningmarkt", "bouwopgave", "scheefwonen"
    ],
    "zorg": [
        "zorg", "gezondheidszorg", "ziekenhuis", "huisarts", "zorgverzekering",
        "eigen risico", "wachtlijst", "zorgkosten", "ouderenzorg", "ggz",
        "geestelijke gezondheidszorg", "verpleging", "thuiszorg"
    ],
    "migratie": [
        "migratie", "asiel", "vluchteling", "immigratie", "grenzen",
        "opvang", "integratie", "naturalisatie", "verblijfsvergunning",
        "asielzoeker", "arbeidsmigratie"
    ],
    "belastingen": [
        "belasting", "inkomstenbelasting", "btw", "vermogensbelasting",
        "box 3", "erfbelasting", "vennootschapsbelasting", "accijns",
        "belastingdruk", "fiscaal", "heffing", "tarief"
    ],
    "samenleving_inclusie": [
        "discriminatie", "gelijkheid", "diversiteit", "inclusie", "emancipatie",
        "lgbtq", "racisme", "gelijke kansen", "mensenrechten", "vrijheid",
        "tolerantie", "acceptatie", "minderheden"
    ],
    "financiering": [
        "begroting", "staatsschuld", "bezuiniging", "investering", "uitgaven",
        "tekort", "overschot", "financiering", "koopkracht", "economie",
        "bbp", "begrotingstekort"
    ]
}

def extract_text_from_pdf(pdf_path):
    """Extract tekst uit PDF bestand"""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Fout bij lezen {pdf_path}: {e}")
    return text

def find_theme_sections(text, theme_keywords):
    """Vind secties in tekst die gerelateerd zijn aan een thema"""
    text_lower = text.lower()
    sections = []
    
    # Splits tekst in paragrafen
    paragraphs = text.split('\n\n')
    
    for para in paragraphs:
        para_lower = para.lower()
        # Check of paragraaf relevante keywords bevat
        keyword_count = sum(1 for keyword in theme_keywords if keyword in para_lower)
        if keyword_count > 0:
            sections.append({
                'text': para.strip(),
                'relevance': keyword_count
            })
    
    # Sorteer op relevantie
    sections.sort(key=lambda x: x['relevance'], reverse=True)
    return sections[:5]  # Top 5 meest relevante secties

def extract_quotes(sections, max_length=200):
    """Extraheer quotes uit secties"""
    quotes = []
    for section in sections:
        text = section['text']
        # Splits in zinnen
        sentences = re.split(r'[.!?]+', text)
        for sentence in sentences:
            sentence = sentence.strip()
            if 50 < len(sentence) < max_length:
                quotes.append(sentence)
                if len(quotes) >= 3:
                    return quotes
    return quotes

def analyze_party_program(pdf_path, party_name):
    """Analyseer een partijprogramma"""
    print(f"Analyseren: {party_name}")
    
    text = extract_text_from_pdf(pdf_path)
    if not text:
        return None
    
    party_data = {
        "partij": party_name,
        "themas": {}
    }
    
    for theme, keywords in THEMES.items():
        sections = find_theme_sections(text, keywords)
        quotes = extract_quotes(sections)
        
        party_data["themas"][theme] = {
            "quotes": quotes[:3],  # Max 3 quotes per thema
            "relevantie": len(sections)
        }
    
    return party_data

# Mapping van bestandsnamen naar partijnamen
PARTY_FILES = {
    "PVV_Programma_Digi_2025.pdf": "PVV",
    "D66-Verkiezingsprogramma-2025-2030-2.pdf": "D66",
    "Verkiezingsprogramma-TK-VVD2025.pdf": "VVD",
    "GroenLinks-PvdA-Verkiezingsprogramma-2025.pdf": "GroenLinks-PvdA",
    "CDA-Verkiezingsprogramma-TK2025-Digitaal-DEFINHOUD.pdf": "CDA",
    "Verkiezingsprogramma_TK_25_A4_v15.pdf": "JA21",
    "BBBVerkiezingsprogrammaTK2025-v2025-1015.pdf": "BBB",
    "Verkiezingsprogramma-DENK-2025.pdf": "DENK",
    "Verkiezingsprogramma_SGP_2025eindversie.pdf": "SGP",
    "SP-verkiezingsprogramma-TK2025.pdf": "SP",
    "PVDD-programma-TK2025-eenvoudige-taal.pdf": "PvdD",
    "Verkiezingsprogramma_2025_CU.pdf": "ChristenUnie",
    "Verkiezingsprogramma_2025-2029_50PLUS.pdf": "50PLUS",
    "volt_verkiezingsprogramma_2025.pdf": "Volt",
    "20250925_Programma_BIJ1_Losse-Pagina-2.pdf": "BIJ1"
}

if __name__ == "__main__":
    results = []
    
    for filename, party_name in PARTY_FILES.items():
        pdf_path = Path(filename)
        if pdf_path.exists():
            party_data = analyze_party_program(pdf_path, party_name)
            if party_data:
                results.append(party_data)
    
    # Sla resultaten op
    with open('partij_standpunten_extracted.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\nAnalyse voltooid! {len(results)} partijen geanalyseerd.")
    print("Resultaten opgeslagen in: partij_standpunten_extracted.json")
