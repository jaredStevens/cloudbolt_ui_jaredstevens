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
1. Vue - is a great tool, because it isn't just a simple Javascript wrapper, it is a full ecosystem where state
management isn't a separate app maintained by other contributors, it is maintained by the Vue team and concurrently with Vue.
   
1. Vuetify - A convenient and robust UI Library of components built specifically for Vue.

1. Vuex - For state management.

1. Vue-Router - For page navigation, including protected navigation when a user is not signed in.

1. GraphQL - Instead of fetching everything from a traditional REST API, and parsing what you need from it, GraphQL
provides the ability to only fetch what is needed.
   
### What could I have done better
1. There needs to be better handling for updates.  I noticed when you remove a post it doesn't show removed until you log out
and log back in.
   
1. Dynamic classes for items generated through v-for loops.  If there are multiple posts, and you click on one to show more
info all the posts open to show more info.
   
1. Better UI, Having a real home page with more information, or a mission statement about what the goal of the app is.

1. Better password management library.  Bcrypt can be a pain with keeping dependencies up to date and not having it fail.