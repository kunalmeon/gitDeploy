First install git in computer

Second we have to make account in gitHub.

Third we will configure our local git repository with name and email with command
git config --global user.name "Karan Budha Air"
git config --global user.email "kunal.neeon@gmail.com"

Fourth we need to make empty git repository 
git init
Initialized empty Git repository in E:/UdemyCourse/13gitpush/.git/

Fifth now we have to make a file called .gitignore where we will list out the files
which we do not want to push into the gitbub like nodemodules and others.

Sixth: Before commit(uploading ) file we have to move files into the stage area.
Stage area is the place where we list the file which are ready to upload.
To check the status of file in the stage we type "git status"
To add file into the stage we hit " git add -A" 
Finally to commit we hit "git commit -m "Initial commit" 


Eight: Once we commit If someone makes change to code then there will be green sign for new added code
and red sign for deleted code. Note we can revert the changes so that we can see what was the change.
To make the changes final we have to follow step Sixth again. Note to add single file into the stage
we need to hit "git add fileName.js" e.g git add app.js



Ninth: Now we are ready to push our code into gitbub account
We have option to drag item or upload from command line, we will use command line. For that we 
copy the code "git remote add origin https://github.com/kunalmeon/learningGit.git" and hit enter, this
code will make connection between git in window with the github.
After that we need to push using "git push origin master"
While pushing we will need the user name and password we made in step 3


Note rm -rf .git is command to uninstall git incase we want to reupload file 

Summary: 
        First install git and make account on gitHub. Once we did that now it is time to make repo in both
        terminal and gitHub page. Connect both. After that we need to make .gitignore file in order to
        determine which files should be uploaded. And then add remaining files to be uploaded.
        Now it is time to commit those files. Once we commit now we can upload file using push 
        command.





PREPARING OF DEPLOYMENT.
1.) Install compression package so that the response which is in text form or html form will
    be compressed before sending to the user. So let us install and use into in the middleware stack
    go to app.js file
2.) Get rid of console.log. To find all the console.log we need to search them into
    search bar.
3.) Another thing we have to fix is that all the urls like localhost://4000 wont work in production
    mode.So let us fix them. The solution is very simple we will delete localhost://4000 part. Rest url
    will work e.g /user/login 
4.) Now let us create final bundle of js.For that we have put new conde for watch.js inside package.json
    "build.js": "parcel build ./public/js/index.js --out-dir ./public/js --out-file bundle.js"
    and run this code into command line using "npm run build.js"  to get final build of all the
     javascript file.

            once we bundle final files. We get .cache files which we can easily remove from .gitIgnore.
5.) Since we have mase may changes now it is time to update and commit them from command line.


//Heroku.
As always make account on heroku and download setup for OS this case windows is mine.
Once we have installed we need to login heroku from command line using "heroku login".
Before opening web app we need to fix couple of things 

first is we have to replace start:"nodemon server.js" with start:'node server' because we selected 
'node' language while downloading heroku installer. 

Second we need to specify the version of node in oreder to work for others so that they must need to
have node version as same as the one we used to develope the app. Since chagnes were made let us commit
to github

