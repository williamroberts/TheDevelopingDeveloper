FROM alpine:3.4

# Install dependencies using APK and NPM
RUN apk add --update nodejs apache2 git && npm install -g grunt-cli bower

# Set the directory we'll be working from
WORKDIR /home/app

# Install local NPM dependencies
ADD package.json /home/app/package.json
RUN npm install

# Install Bower dependencies
ADD .bowerrc /home/app/.bowerrc
ADD bower.json /home/app/bower.json
RUN bower install --config.interactive=false --allow-root

# Copy everything else in
ADD . /home/app/

# Execute Grunt build
RUN grunt

# Setup Apache
COPY apache-conf.conf /etc/apache2/conf.d/
RUN mkdir -p /run/apache2  && \
    sed -i 's@#LoadModule rewrite_module modules/mod_rewrite.so@LoadModule rewrite_module modules/mod_rewrite.so@' /etc/apache2/httpd.conf && \
    sed -i 's@#LoadModule deflate_module modules/mod_deflate.so@LoadModule deflate_module modules/mod_deflate.so@' /etc/apache2/httpd.conf

# Run Apache
CMD ["httpd", "-D", "FOREGROUND"]
