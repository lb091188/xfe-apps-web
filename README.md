# Nginx AutoIdex Page
基于VueJS,提供美化Nginx 文件预览页面服务。

## 开发
老项目迁移到了 old-vue2 分支上，请先前往对应分支下载打包部署哈。

新方向是 引入 ElementUI 以及Vue3 TS 进行开发。正在进行中。敬请关注

### 部署
由于数据都是通过 `/data/` 前缀获取的，所以nginx 配置需要加上一个接口数据的反向代理配置，并且需要将返回数据从 html 改为 json。当前项目美化的逻辑如下。

![项目美化Nginx说明](public/image.png)


项目打包后，可以参考下面的配置说明来配置您的 nginx。**以下的配置是假定您开始一个全新的Nginx**,如果您想在已有的 Nginx 上配置这个服务的话，只需要参考 `server` 部分即可。具体 Nginx 配置我就不涉及了。毕竟不是我的专业，请各位自行百度或者谷歌
``` nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
	worker_connections 768;
}

http {
	sendfile on;
	tcp_nopush on;
	tcp_nodelay on;
	keepalive_timeout 10000;
	types_hash_max_size 2048;
	client_max_body_size 2048m;


	include /etc/nginx/mime.types;
	default_type application/octet-stream;

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	##
	# 加上Gzip 访问更快
	##

	gzip  on;
	gzip_min_length  1k;
	gzip_buffers     4 16k;
	gzip_http_version 1.1;
	gzip_comp_level 9;
	gzip_types text/css text/xml application/javascript application/json application/wasm;
	gzip_disable "MSIE [1-6]\.";
	gzip_vary on;

	##
	# Virtual Host Configs
	##
  server {
    # 端口及域名配置
    listen 80;
    charset utf8;
    server_name your.own.com;
    
    # 项目静态文件配置，root 对应静态文件部署的位置
    location / {
      root /you/dir/to/this/object/build/dist;
      try_files $uri $uri/ /index.html;
      index index.html;
      autoindex off;
    }
    
    # 项目要美化的ngixn预览服务地址及配置
    location /data {
      # 指向要美化访问的文件目录
      alias /you/dir/to/you/static/file;
      autoindex on;
      autoindex_exact_size on;
      autoindex_localtime on;
      # 这个配置将 返回的html给是转换成 json格式
      autoindex_format    json;

      # 如果要加上访问权限的话，可以参考这个方式
      # auth_basic "Restricted";
      # auth_basic_user_file /etc/nginx/htpasswd;

      
    }
  }
	
}
```