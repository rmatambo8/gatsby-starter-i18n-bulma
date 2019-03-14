import React, { Component } from 'react'
import Link from "gatsby-link"
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Helmet from 'react-helmet'
import { getCurrentLangKey, getLangs, getUrlForLang, getSlugAndLang } from 'ptz-i18n';
import { IntlProvider, addLocaleData } from 'react-intl';
import { rhythm } from "../utils/typography"
import 'intl';

import en from 'react-intl/locale-data/en';
import 'intl/locale-data/jsonp/en';
import it from 'react-intl/locale-data/it';
import 'intl/locale-data/jsonp/it';
import './all.sass'
import 'font-awesome/css/font-awesome.css'

import articleId from '../data/articleTree'

const getIdUrl = (id, langKey) => {
  console.log("inside the getter");
  switch (langKey) {
    //we need the inverse of the current page...
    case 'en': return articleId[id][0];
    case 'it': return articleId[id][1];
    default: return null;
  }
};

const startPath = (langKey, langsMenu, basename, url) => {
  const lengthLangKey = langKey.length;
  console.log("length of the langKey:");
  console.log(lengthLangKey);
  var indx;
  switch (langKey) {
    case 'en': return indx = langsMenu[0].link.indexOf(basename);
    case 'it': return indx = langsMenu[1].link.indexOf(basename);
    default: return null;
    console.log("indx inside startPath:");
    console.log(indx);
  }
  console.log("indx inside startPath:");
  console.log(indx);
  indx = 9;
  console.log("url:");
  console.log(url);
  const basePath = url.slice(lengthLangKey + 2, indx);
  console.log("basePath is:");
  console.log(basePath);
  //var basePath = '/blog'
  return basePath;
};

const setLangsMenu = ( langsMenu, id, langKey, basePath) => {
  console.log("inside the setter");

  switch (langKey) {
    //we need the inverse of the current page...
    //case 'en': return this.langsMenu[0].link = "/it/blog/" + getIdUrl(id_article, langKey);
    case 'en': return langsMenu[0].link = `/it/${basePath}` + getIdUrl(id, langKey);
    //return langsMenu[1].link.replace(getSlugAndLang('any', langsMenu[1].link), getIdUrl(id, langKey));
    //case 'it': return this.langsMenu[0].link = "/en/blog/" + getIdUrl(id_article, langKey);
    case 'it': return langsMenu[1].link = `/en/${basePath}` + getIdUrl(id, langKey);
    default: return null;
  }
};

const setLangsMenu2 = ( langsMenu, id, basePath) => {
  console.log("inside the setter");
  var eng = langsMenu[0].link;
  var ita = langsMenu[1].link;
  eng = `/en/${basePath}/` + getIdUrl(id, 'en');
  ita = `/it/${basePath}/` + getIdUrl(id, 'it');

  return [eng, ita];

};

// add concatenated locale data
addLocaleData([...en, ...it]);

class TemplateWrapper extends Component {
  constructor(props) {
    super(props);
    this.children = this.props.children;
    const data = this.props.data;
    const location = this.props.location;
    const url = location.pathname;
    console.log("url is: ");
    console.log(url);
    const { langs, defaultLangKey } = data.site.siteMetadata.languages;
    this.langKey = getCurrentLangKey(langs, defaultLangKey, url);
    this.homeLink = `/${this.langKey}/`;
    console.log("language is: ");
    console.log(this.langKey);
    this.langsMenu = getLangs(langs, this.langKey, getUrlForLang(this.homeLink, url));
    //console.log("urlForLang is: ");
    //console.log(getUrlForLang(this.homeLink, url, this.langKey));
    console.log("langsMenu is: ");
    console.log(this.langsMenu);
    const id_article = data.markdownRemark.frontmatter.id;
    console.log(id_article);
    const basename = getIdUrl(id_article, 'it');
    const indx = this.langsMenu[1].link.indexOf(basename);
    const lengthLangKey = this.langKey.length;
    console.log("length of the langKey:");
    console.log(lengthLangKey);
    console.log("start index:");
    console.log(indx);
    console.log("basename:");
    console.log(basename);
    const basePath = url.slice(lengthLangKey + 2, indx);
    console.log("basePath is:");
    console.log(basePath);

    const options = {
      langKeyDefault: 'any',
      prefixDefault: true
   };
    console.log("slug is: ");
    //var slug = getSlugAndLang(options, this.langsMenu[0].link);
    var slug = getSlugAndLang(options, '/src/pages/blog/2019-03-11-notizie-dal-pianeta-arte.it.md');
    console.log(slug);
    var Path = startPath(this.langKey, this.langsMenu, basename, url)
    console.log("path is:");
    //Path = '/blog'
    console.log(Path);

    //this.langsMenu[0].link = "/en/blog/" + getIdUrl(id_article, this.langKey);
    var out = setLangsMenu2( this.langsMenu, id_article, Path);
    console.log(out);
    // get the appropriate message file based on langKey
    // at the moment this assumes that langKey will provide us
    // with the appropriate language code
    this.i18nMessages = require(`../data/messages/${this.langKey}`);
  }
  render() {
    return (
      <IntlProvider
        locale={this.langKey}
        messages={this.i18nMessages}
      >
        <div>
          <Helmet
            title="Gatsby Default Starter"
            meta={[
              { name: 'description', content: 'Sample' },
              { name: 'keywords', content: 'sample, something' },
            ]}
          />
          <Header langKey={this.langKey} langs={this.langsMenu} />
          <div>
            {this.children}
          </div>
          <Footer langKey={this.langKey}/>
        </div>
      </IntlProvider>
    );
  }
}

export default TemplateWrapper
