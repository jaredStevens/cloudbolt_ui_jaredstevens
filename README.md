# "InstaSnapChat?"

## This app uses Vue, Vuetify, Vuex, Vue-Router, and GraphQL

### To Run:
#### Create a variable.env file in the root directory with 2 variables:
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.wov5z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    SECRET (this can be any random string consisting of letters and numbers for password hashing) for example
    SECRET=1jlajhahihahiwaal
####
    From the root, run `npm start` and it will run the client side and node server concurrently.

#### data.json file
    There are image urls in the data.json file to create posts
    

# Postmortem

### Tools Used
1. Vue - This is an amazing JavaScript library.  It is a full ecosystem, and all aspects of it are maintained by the core Vue team.
   
1. Vuetify - A convenient and robust UI Library of components built specifically for Vue.

1. Vuex - For state management.

1. Vue-Router - Used for page routing/navigation.

1. GraphQL - Instead of fetching everything from a traditional REST API, and parsing what you need from it, GraphQL
provides the ability to only fetch what is needed.
   
### What could I have done better
1. There needs to be better handling for updates.  I noticed when you remove a post it doesn't show removed until you log out
and log back in.
   
1. Dynamic classes for items generated through v-for loops.  If there are multiple posts, and you click on one to show more
info all the posts open to show more info.
   
1. Better UI, Having a real home page with more information, or a mission statement about what the goal of the app is.

1. I need to find a better password management dependency.  Bcrypt can be a pain with keeping dependencies up to date and not having it fail.