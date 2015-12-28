var domain = "http://localhost";
var url = domain;
var meta_description = "description";
var share_image = domain + "/img/ogp.png";

module.exports = {
  domain: domain,
  url: url,
  
  siteName: "template",
  title: "template",
  
  meta_description: "description",
  meta_keywords: ["key", "words"],
  
  share_image: domain + "/img/ogp.png",
  
  og_description: meta_description,
  og_image_url: share_image,
  og_image_width: 0,
  og_image_height: 0,
  
  tw_description: meta_description,
  tw_hashtags: ["hashtag"],
  tw_site: "@hoge",
  tw_creator: "@hoge",
  
  line_description: meta_description + " " + url,
  
  fb_appid: "",
  
  favicon_url: domain + "/favicon.ico",
  apple_touch_icon_url: domain + "/favicon.ico",
};
