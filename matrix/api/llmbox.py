from langchain.chains.summarize import load_summarize_chain
from langchain import OpenAI, PromptTemplate, LLMChain
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains.mapreduce import MapReduceChain
from langchain.prompts import PromptTemplate
from langchain.docstore.document import Document

import os

os.environ["OPENAI_API_KEY"] = "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"
def get_sentiment(item):
    prompt = """
        Summarise the sentiment of the text as either positive, neutral, negative. 
        
        {context}
        
        Sentiment:  """
    prompt_template = PromptTemplate(input_variables=["context"], template=prompt)

    llm = OpenAI(temperature=0)
    text_splitter = CharacterTextSplitter()
    texts = text_splitter.split_text(item["content"])
    docs = [Document(page_content=t) for t in texts]

    llm_chain = LLMChain(
        llm=llm,
        prompt=prompt_template
    )

    return llm_chain(item["content"])["text"].strip().lower()


def get_summary(item):
    """
        Generate a summary for the given item's content using OpenAI's language model and text splitting techniques.

        Args:
            item (dict): A dictionary containing the item's content.

        Returns:
            str: The generated summary for the content.
    """
    llm = OpenAI(temperature=0)
    text_splitter = CharacterTextSplitter()
    texts = text_splitter.split_text(item["content"])
    chain = load_summarize_chain(llm, chain_type="map_reduce")
    docs = [Document(page_content=t) for t in texts]
    return chain.run(docs)


