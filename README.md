
#  FormsGPT (Conversational Form Design) Proof of Concept

This project was created in order to streamline the creation and editing of forms by new CHEFS users. Allowing the user to type, in natural language, a request for generating or altering an existing form. Features included in this proof of concept include:

* __Context__: Adding documentation or source material for the forms product, in this case custom form components, and passing this information as reference to the Large Language Model. The large language model then can utilize this specialised information which may not have been in its training data. 
* __Form Compression__: This was implemented to reduce the number of tokens used in the LLM requests. A token is the name for the base unit of data for LLM processing. In a text context a token could be a word, a section of a word, or a  single character.  In sending an edit request the entire existing form which may consist of thousands of tokens is sent to the LLM. Shrinking these forms allows for a more efficient use of the LLM's processing. 
* __Output Sanitizing__: Reducing the response space into a form JSON aids in preventing unintended usage of the LLM.



## Running the Project

### Environment Variables

To run this project, you will need to alter the following environment variables in the sample.env file and rename to .env

__Backend__

`backend/sample.env` :

`OPENAI_API_KEY=YOUR_OPENAI_API_KEY` : See instructions below for generating an API Key


__Frontend__


For `frontend/sample.env` :

`REACT_APP_BACKEND=http://{Your IP Address}:3081`


### Generating an OpenAI API Key

1. __Sign Up or Log In__: Visit [OpenAI Platform](https://platform.openai.com/) and sign in to your OpenAI account. If you don’t have an account, you’ll need to sign up first.


2. __Access the API Section__: Once logged in, navigate to the API keys section. This is usually accessible through the main navigation menu as shown below.

![How to navigate to API section](/assets/navigation.png)

3. __Generate New API Key__: Using the `+ Create new Secret key` button we can create a new Token.  This token can be shared across the team. Also we can  create an organisation and invite members to the  team so can create secret keys for users as well. You can control the Organisation and Team from the Settings menu.

![Create an Organization](/assets/organization.png)

4. __Add credit card to Billing Section__: Within the OpenAI account page, find and navigate to the Settings section. You can add the payment method in here.

![Add billing information](/assets/billing.png)

5. __Model Selection and Pricing__: You can find OpenAI API pricing here at [Pricing](https://openai.com/pricing). We have defaulted to the GPT 3.5 Turbo Model. Below you can see the pricing and rate limits for the selected model.

![Pricing for GPT 3.5 Turbo](/assets/pricing.png)
![Limits for GPT 3.5 Turbo](/assets/limits.png)

6. __Reviewing Usage__: To review the usage on your OpenAI account, you can click here [Platform Account Usage](https://platform.openai.com/usage)

![Usage on your account](/assets/usage.png)



### Building and Running


#### _Running with Docker_

Ensure you have the latest version of Docker Desktop installed with the command line interface.

Navigate to `/docker/`

Update the `/docker/sample.env` file and rename it to `.env`

Run `docker-compose up --build -d`

To test if the backend is up and running, you can navigate to [http://localhost:3081/health](http://localhost:3081/health).

To validate it running correctly, you can navigate to [http://localhost](http://localhost) to use your dockerized instance of the frontend.




#### _Running from command line_

Next, in a terminal, navigate to `/backend/`.

run `npm install`

and `node server.js` to run the backend.'

To test if the backend is up and running, you can navigate to [http://localhost:3081/health](http://localhost:3081/health).

in a new terminal window, navigate to `/frontend/`

run `npm install`

and `npm start` to run the frontend.

You can then navigate to [http://localhost:3000](http://localhost:3000) to use your local instance.

