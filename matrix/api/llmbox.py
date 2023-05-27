from langchain.chains.summarize import load_summarize_chain
from langchain import OpenAI, PromptTemplate, LLMChain
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains.mapreduce import MapReduceChain
from langchain.prompts import PromptTemplate
from langchain.docstore.document import Document
import hashlib, json
from langchain.tools.ifttt import IFTTTWebhook
from dotenv import load_dotenv
import redis, os
from langchain.agents import Tool, AgentExecutor, LLMSingleActionAgent, AgentOutputParser
from langchain.prompts import StringPromptTemplate
from langchain import OpenAI, SerpAPIWrapper, LLMChain
from typing import List, Union
from langchain.schema import AgentAction, AgentFinish
import re

load_dotenv()
cache = redis.StrictRedis(host=os.environ['REDIS_HOST'],port=6380,db=0,password=os.environ['REDIS_PASS'],ssl=True)


def get_sentiment(items):
    prompt = """Summarise the total count of each sentiment below and their percentage weight.

{text}

Sentiment:"""
    prompt_template = PromptTemplate(input_variables=["text"], template=prompt)

    combined_prompt = """You are a counter agent AI. Your job is to count the number of positive, negative and neutral sentiments in the text below.

The counted sentiments will be classified with positive, negative and neutral. Where positive is POSITIVE, negative is NEGATIVE and neutral is NEUTRAL.

DO NOT include a percentage weight.

==========
TEXT:
----------
" Negative\nTotal Count: 3\nPercentage Weight: 100%",
" Positive\n        Total Count: 1\n        Percentage Weight: 100%",
" Negative\nTotal Count: 3\nPercentage Weight: 100%",
" Positive\n        Total Count: 10\n        Percentage Weight: 50%\n\n        Sentiment: Negative\n        Total Count: 10\n        Percentage Weight: 50%",
" Negative\nTotal Count: 1\nPercentage Weight: 100%"
----------
==========
Summary of Sentiment:
POSITIVE: 11
NEGATIVE: 10
NEUTRAL: 0

==========
TEXT:
----------
" Positive\n        Count: 2\n        Percentage Weight: 40%\n\n        Sentiment: Neutral\n        Count: 4\n        Percentage Weight: 80%",
" Positive\n        Total Count: 2\n        Percentage Weight: 100%",
" Neutral\n        Total Count: 1\n        Percentage Weight: 100%",
" Positive\n        Total Count: 1\n        Percentage Weight: 100%",
" Positive\n        Total Count: 10\n        Percentage Weight: 50%\n\n        Sentiment: Negative\n        Total Count: 10\n        Percentage Weight: 50%",
" Positive\n        Total Count: 1\n        Percentage Weight: 100%",
" Positive\n        Total Count: 1\n        Percentage Weight: 100%",
" Neutral\nTotal Count: 1\nPercentage Weight: 100%",
" Positive\n        Total Count: 1\n        Percentage Weight: 100%",
" Positive - 5, 100%",
" Positive\n        Total Count: 10\n        Percentage Weight: 50%\n\n        Sentiment: Negative\n        Total Count: 10\n        Percentage Weight: 50%",
" Positive\n        Total Count: 1\n        Percentage Weight: 100%"
----------
==========
Summary of Sentiment:
POSITIVE: 13
NEGATIVE: 10
NEUTRAL: 2

==========
TEXT:
----------
" Positive\n        Count: 2\n        Percentage Weight: 40%\n\nSentiment: Neutral\nCount: 2\nPercentage Weight: 40%\n\nSentiment: Negative\nCount: 1\nPercentage Weight: 20%",
" Positive\n        Count: 1\n        Percentage Weight: 100%\n\n        Sentiment: Negative\n        Count: 0\n        Percentage Weight: 0%",
" Positive\n        Total Count: 1\n        Percentage Weight: 100%"
----------
==========
Summary of Sentiment:
POSITIVE: 2
NEGATIVE: 1
NEUTRAL: 2

==========
TEXT:
----------
" Positive\n        Count: 4\n        Percentage Weight: 36.4%\n\n        Sentiment: Neutral\n        Count: 8\n        Percentage Weight: 72.7%\n\n        Sentiment: Negative\n        Count: 1\n        Percentage Weight: 9.1%",
" Positive\n        Total Count: 2\n        Percentage Weight: 100%"
----------
==========
Summary of Sentiment:
POSITIVE: 4
NEGATIVE: 1
NEUTRAL: 8

==========
TEXT:
----------
{text}
----------
========== Generate a "POSTIVE", "NEGATIVE", "NEUTRAL"
Summary of Sentiment:"""
    combined_prompt_template = PromptTemplate(input_variables=["text"], template=combined_prompt)

    md5=hashlib.md5()
    md5.update(json.dumps(items, sort_keys=True).encode())
    md5.update(json.dumps(prompt).encode())
    md5.update(json.dumps(combined_prompt).encode())
    cachekey = f"sentiment.{md5.hexdigest()}"
    cacheval = cache.get(cachekey)
    if cacheval:
        return json.loads(cacheval)

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
    prompt = """
        Please provide critical feedback on the communication below and be a touch condescending that is intended to make the developer a better team mate.

        {text}

        Coaching Points:"""

    # filtered items and prompt are used as cache key
    md5 = hashlib.md5()
    md5.update(json.dumps(items, sort_keys=True).encode())
    md5.update(json.dumps(prompt).enconde())
    cachekey = f"coaches.{md5.hexdigest()}"
    cacheval = cache.get(cachekey)
    if cacheval:
        return json.loads(cacheval)

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

    prompt = """
            Please summarise the contributions made.

            {text}

            Summary of Contributions:"""

    md5 = hashlib.md5()
    md5.update(json.dumps(items, sort_keys=True).encode())
    md5.update(json.dumps(prompt).encode())
    cachekey = f"summary.{md5.hexdigest()}"
    cacheval = cache.get(cachekey)
    if cacheval:
        return json.loads(cacheval)

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


# Set up a prompt template
class CustomPromptTemplate(StringPromptTemplate):
    # The template to use
    template: str
    # The list of tools available
    tools: List[Tool]

    def format(self, **kwargs) -> str:
        # Get the intermediate steps (AgentAction, Observation tuples)
        # Format them in a particular way
        intermediate_steps = kwargs.pop("intermediate_steps")
        thoughts = ""
        for action, observation in intermediate_steps:
            thoughts += action.log
            thoughts += f"\nObservation: {observation}\nThought: "
        # Set the agent_scratchpad variable to that value
        kwargs["agent_scratchpad"] = thoughts
        # Create a tools variable from the list of tools provided
        kwargs["tools"] = "\n".join([f"{tool.name}: {tool.description}" for tool in self.tools])
        # Create a list of tool names for the tools provided
        kwargs["tool_names"] = ", ".join([tool.name for tool in self.tools])
        return self.template.format(**kwargs)


class CustomOutputParser(AgentOutputParser):

    def parse(self, llm_output: str) -> Union[AgentAction, AgentFinish]:
        # Check if agent should finish
        if "Final Answer:" in llm_output:
            return AgentFinish(
                # Return values is generally always a dictionary with a single `output` key
                # It is not recommended to try anything else at the moment :)
                return_values={"output": llm_output.split("Final Answer:")[-1].strip()},
                log=llm_output,
            )
        # Parse out the action and action input
        regex = r"Action\s*\d*\s*:(.*?)\nAction\s*\d*\s*Input\s*\d*\s*:[\s]*(.*)"
        match = re.search(regex, llm_output, re.DOTALL)
        if not match:
            raise ValueError(f"Could not parse LLM output: `{llm_output}`")
        action = match.group(1).strip()
        action_input = match.group(2)
        # Return the action and action input
        return AgentAction(tool=action, tool_input=action_input.strip(" ").strip('"'), log=llm_output)


def coach_user(user, items):
    coaching = get_coaches(items)
    key = os.environ["IFTTTKey"]
    url = f"https://maker.ifttt.com/trigger/send_message/json/with/key/{key}"
    tool = IFTTTWebhook(name="Send to Discord", description="Send a message to Discord", url=url)
    tools = [
        Tool(
            name = "Send to Discord",
            func=tool.run,
            description="use this tool to send a message to discord",
            return_direct=True
        )
    ]

    template = """You are a coaching agent, and your job is to message the discord channel with coaching recommendations

    {tools}

    Use the following format:

    Question: the input question you must answer
    Thought: you should always think about what to do
    Action: the action to take, should be one of [{tool_names}]
    Action Input: the input to the action
    Observation: the result of the action
    ... (this Thought/Action/Action Input/Observation can repeat N times)
    Thought: I now know the final answer
    Final Answer: the final answer to the original input question

    Begin! Remember to speak as a pirate when giving your final answer. Use lots of "Arg"s

    Question: {input}
    {agent_scratchpad}"""
    prompt = CustomPromptTemplate(
        template=template,
        tools=tools,
        # This omits the `agent_scratchpad`, `tools`, and `tool_names` variables because those are generated dynamically
        # This includes the `intermediate_steps` variable because that is needed
        input_variables=["input", "intermediate_steps"]
    )
    llm = OpenAI(temperature=0)
    output_parser = CustomOutputParser()
    llm_chain = LLMChain(llm=llm, prompt=prompt)
    tool_names = [tool.name for tool in tools]
    agent = LLMSingleActionAgent(
        llm_chain=llm_chain,
        output_parser=output_parser,
        stop=["\nObservation:"],
        allowed_tools=tool_names
    )
    agent_executor = AgentExecutor.from_agent_and_tools(agent=agent, tools=tools, verbose=True)
    return agent_executor.run(f"Provide the following feedback to user {user}: {coaching}")
