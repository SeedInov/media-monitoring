import os
import re
import yake
import langdetect
import stopwordsiso
import importlib.resources
from langdetect import detect as lang_detect, DetectorFactory

# Setting a seed for the language detector to ensure consistent results
DetectorFactory.seed = 0
lang_detect("warm-up")  # Initial detection to warm up the language detector

langdetect_profiles = os.path.join(importlib.resources.files(langdetect).__str__(), "profiles")
languages_langdetect = set(os.listdir(langdetect_profiles))  # Supported languages by langdetect

# Supported languages by YAKE for keyword extraction
languages_yake = {'ar', 'bg', 'br', 'cz', 'da', 'de', 'el', 'en', 'es', 'et', 'fa', 
 'fi', 'fr', 'hi', 'hr', 'hu', 'hy', 'id','it','ja','lt','lv','nl', 
 'no','pl','pt','ro','ru','sk','sl','sv','tr','uk','zh'}

# Checking for any additional YAKE languages by inspecting the stopwords directory
stop_words_path = os.path.join(importlib.resources.files(yake).__str__(), "StopwordsList")
if os.path.exists(stop_words_path):
    additional_yake_languages = set(re.findall(r"stopwords_([a-z]+)\.txt", "\n".join(os.listdir(stop_words_path))))
    languages_yake.update(additional_yake_languages)

# Dictionary to map langdetect languages to YAKE languages
LangCode = str
KeywordsList = set[str]
YAKE_LANG_MAP: dict[str, tuple[LangCode, KeywordsList | None]] = {}

# Mapping YAKE languages to corresponding langdetect languages
for yake_lang in languages_yake:
    for langdetect_lang in languages_langdetect:
        if langdetect_lang.find(yake_lang) != -1:  # Partial match to handle variations in language codes
            YAKE_LANG_MAP[langdetect_lang] = (yake_lang, None)

# Identifying langdetect languages that couldn't be mapped directly to YAKE
unmapped_langdetect_languages = languages_langdetect - YAKE_LANG_MAP.keys()

# Finding languages that have stopwords available in stopwords-iso
stopwordsiso_languages: set[str] = stopwordsiso._core._LANGS
languages_with_stopwords = stopwordsiso_languages.intersection(unmapped_langdetect_languages)

# Updating the mapping with languages that have stopwords available
YAKE_LANG_MAP.update({
    lang: (lang, stopwordsiso.stopwords(lang)) for lang in languages_with_stopwords
})
