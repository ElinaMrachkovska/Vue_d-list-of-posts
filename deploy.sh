set -e
npm run build
cd dist
echo > .nojekyll
git init
git checkout main || git checkout -b main
git add -A
git commit -m 'deploy'
git push -f https://github.com/ElinaMrachkovska/Vue_d-list-of-posts.git main:gh-pages
cd -