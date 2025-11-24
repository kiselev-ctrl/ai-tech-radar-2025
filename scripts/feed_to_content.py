#!/usr/bin/env python3
import os
import re
import feedparser
import google.generativeai as genai
from datetime import datetime

RSS_FEEDS = [
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://openai.com/blog/rss.xml",
    "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
]

OUTPUT_DIR = "content/posts"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

genai.configure(api_key=GEMINI_API_KEY)

def clean_filename(title):
    filename = title.lower()
    filename = re.sub(r'[^\w\s-]', '', filename)
    filename = re.sub(r'[-\s]+', '-', filename)
    filename = filename.strip('-')
    return f"{filename[:60]}.md"

def generate_content_with_gemini(entry):
    try:
        title = entry.get('title', 'No title')
        summary = entry.get('summary', 'No summary')
        link = entry.get('link', '')
        
        prompt = f"""Translate and expand this AI article to Russian with context and analysis.
Format: Markdown.

Title: {title}
Content: {summary}

Write a Russian article with intro, main content, and conclusion."""
        
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error: {e}")
        return f"# {title}\n\n{summary}\n\n[Source]({link})"

def fetch_and_process_rss():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    for rss_url in RSS_FEEDS:
        print(f"Processing: {rss_url}")
        try:
            feed = feedparser.parse(rss_url)
            if not feed.entries:
                continue
            
            entry = feed.entries[0]
            filename = clean_filename(entry.get('title', 'post'))
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            if os.path.exists(filepath):
                print(f"  Skipping: {filename}")
                continue
            
            content = generate_content_with_gemini(entry)
            frontmatter = f"""---
title: {entry.get('title', 'Untitled')}
date: {datetime.now().isoformat()}
source: {entry.get('link', rss_url)}
tags:
  - AI
  - Technology
---
"""
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(frontmatter + content)
            
            print(f"  Created: {filename}")
        except Exception as e:
            print(f"  Error: {e}")
            continue

if __name__ == "__main__":
    print("Starting RSS to Markdown conversion...")
    fetch_and_process_rss()
    print("Done!")
