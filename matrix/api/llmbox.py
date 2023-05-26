from langchain.chains.summarize import load_summarize_chain
from langchain import OpenAI, PromptTemplate, LLMChain
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains.mapreduce import MapReduceChain
from langchain.prompts import PromptTemplate
from langchain.docstore.document import Document
import hashlib, json

from dotenv import load_dotenv
import redis, os
load_dotenv()
cache = redis.StrictRedis(host=os.environ['REDIS_HOST'],port=6380,db=0,password=os.environ['REDIS_PASS'],ssl=True)


def get_sentiment(items):
    md5=hashlib.md5()
    md5.update(json.dumps(items, sort_keys=True).encode())
    cachekey = f"sentiment.{md5.hexdigest()}"
    cacheval = cache.get(cachekey)
    if cacheval:
        return json.loads(cacheval)
    prompt = """
        Summarise the sentiment of the text as either positive, neutral, negative.  Give extreme weight to negativity.
        
        {text}
        
        Sentiment:  """
    prompt_template = PromptTemplate(input_variables=["text"], template=prompt)

    combined_prompt = """
            Summarise the total count of each sentiment below and their percentage weight.

            {text}

            Summary of Sentiment:  """
    combined_prompt_template = PromptTemplate(input_variables=["text"], template=combined_prompt)

    llm = OpenAI(temperature=0)
    docs = [Document(page_content=t['content']) for t in items]

    llm_chain = load_summarize_chain(
        llm=llm, chain_type="map_reduce", return_intermediate_steps=True,
        map_prompt=prompt_template, combine_prompt=combined_prompt_template
    )

    resp = llm_chain({"input_documents": docs}, return_only_outputs=True)#.get('output_text').strip()#llm_chain(item["content"])["text"].strip().lower()
    resp["items"] = items
    cache.set(cachekey, json.dumps(resp, sort_keys=True))
    return resp

def get_coaches(items):
    md5 = hashlib.md5()
    md5.update(json.dumps(items, sort_keys=True).encode())
    cachekey = f"coaches.{md5.hexdigest()}"
    cacheval = cache.get(cachekey)
    if cacheval:
        return json.loads(cacheval)
    prompt = """
        Please provide critical feedback on the communication below and be a touch condescending that is intended to make the developer a better team mate.

        {text}

        Coaching Points:  """
    prompt_template = PromptTemplate(input_variables=["text"], template=prompt)

    llm = OpenAI(temperature=0)
    docs = [Document(page_content=t['content']) for t in items]

    chain = load_summarize_chain(llm, chain_type="map_reduce", return_intermediate_steps=True,
                                 map_prompt=prompt_template, combine_prompt=prompt_template)
    resp = chain({"input_documents": docs},
                     return_only_outputs=True)  # .get('output_text').strip()#llm_chain(item["content"])["text"].strip().lower()
    resp["items"] = items
    cache.set(cachekey, json.dumps(resp, sort_keys=True))
    return resp

def get_summaries(items):
    """
        Generate a summary for the given item's content using OpenAI's language model and text splitting techniques.

        Args:
            item (dict): A dictionary containing the item's content.

        Returns:
            str: The generated summary for the content.
    """
    md5 = hashlib.md5()
    md5.update(json.dumps(items, sort_keys=True).encode())
    cachekey = f"summary.{md5.hexdigest()}"
    cacheval = cache.get(cachekey)
    if cacheval:
        return json.loads(cacheval)
    prompt = """
            Please summarise the contributions made.

            {text}

            Summary of Contributions:  """
    prompt_template = PromptTemplate(input_variables=["text"], template=prompt)

    llm = OpenAI(temperature=0)
    docs = [Document(page_content=t['content']) for t in items]

    chain = load_summarize_chain(llm, chain_type="map_reduce", return_intermediate_steps=True,
                                 map_prompt=prompt_template, combine_prompt=prompt_template)
    resp = chain({"input_documents": docs},
                     return_only_outputs=True)  # .get('output_text').strip()#llm_chain(item["content"])["text"].strip().lower()
    resp["items"] = items
    cache.set(cachekey, json.dumps(resp, sort_keys=True))
    return resp


