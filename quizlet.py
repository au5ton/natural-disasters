#!/usr/bin/env python3

from bs4 import BeautifulSoup
import json
import re

# something that won't get used in a sentence: emojis!
wordsep = '🏳'
cardsep = '🏴'

def stripHTML(body):
    return BeautifulSoup(body, "html.parser").get_text()

def numberEmoji(n: int):
    m = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"]
    if int(n / 10) > 0:
        return str(m[n % 10]) + str(numberEmoji(int(n / 10)))
    else:
        return m[n]

def makeEntry(item):
    payload = item["hidata"]["payload"]

    if item["type"] == 'MULTIPLE_CHOICE':
        out = f'{stripHTML(payload["prompt"])}{wordsep}'
        for choice in payload["choices"]:
            if choice["key"] == payload["answer"]:
                out += f'🔘 {stripHTML(choice["content"])}\n'
            else:
                out += f'⚪️ {stripHTML(choice["content"])}\n'
        return f'{out}{cardsep}'
    
    
    if item["type"] == 'MULTIPLE_CHOICE_MULTI_SELECT':
        out = f'{stripHTML(payload["prompt"])}{wordsep}'
        for choice in payload["choices"]:
            flag = True
            for ans in payload["answers"]:
                if choice["key"] == ans:
                    out += f'✅ {stripHTML(choice["content"])}\n'
                    flag = False
            if flag:
                out += f'⬜️ {stripHTML(choice["content"])}\n'
        return f'{out}{cardsep}'


    if item["type"] == 'MATCHING':
        out = f'{stripHTML(payload["prompt"])}{wordsep}'
        pairs = dict()
        for ans in payload["answers"]:
            pairs[ans["prompt"]] = ans["choices"][0]
        
        for key in pairs.keys():
            Q = None
            A = None
            for prompt in payload["prompts"]:
                if prompt["key"] == key:
                    Q = prompt["content"]
            for choice in payload["choices"]:
                if choice["key"] == pairs[key]:
                    A = choice["content"]
            out += f'\"{stripHTML(Q)}\" ↔ \"{stripHTML(A)}\"\n'
        return f'{out}{cardsep}'


    if item["type"] == 'ORDERING':
        out = f'{stripHTML(payload["prompt"])}{wordsep}'
        n = 1
        for ans in payload["answers"]:
            for choice in payload["choices"]:
                if choice["key"] == ans:
                    out += f'{numberEmoji(n)}: {stripHTML(choice["text"])}\n'
                    n += 1
                    break
        return f'{out}{cardsep}'
    

    if item["type"] == 'FILL_IN_THE_BLANK':
        # strip HTML
        pmt = stripHTML(payload["prompt"])
        # replace `${` with `{`
        pmt = re.sub("\$\{", '{', pmt)
        # replace `{...}` with `____`
        pmt = re.sub(" *\{[^}]*\}*", '______', pmt)
        out = f'{pmt}{wordsep}'
        n = 1
        for ans in payload["answers"]:
            r = ','.join([stripHTML(x) for x in ans["values"]])
            out += f'{numberEmoji(n)}: {r}\n'
            n += 1
        return f'{out}{cardsep}'

    
    if item["type"] == "TRUE_FALSE":
        out = f'{stripHTML(payload["prompt"])}{wordsep}'
        if payload["answer"] == "true":
            out += f'➕ True\n'
        else:
            out += f'➖ False\n'
        return f'{out}{cardsep}'

    return f''


with open('nd.deobfuscated.json', 'r') as infile:
    with open('nd.quizlet', 'w', encoding='utf-8') as outfile:
        data = json.loads(infile.read())
        for d in data:
            for e in d["$assessmentItems"]:
                outfile.write(f'{makeEntry(e)}\n')
        