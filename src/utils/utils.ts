'use strict';

const partition = (template: string, key1: string, key2: string): [string, string, string] => {
    const i = template.indexOf(key1);
    if (i < 0) return [template, '', ''];
    const j = template.substr(i + key1.length).indexOf(key2);
    if (j < 0) {
        console.log('error in partitioning [${template}: key2 [${key2}] not found following key1 [${key1}].');
        return [template, '', ''];
    }
    const pre = template.substr(0, i);
    const body = template.substr(i + key1.length, j);
    const post = template.substr(i + key1.length + j + key2.length);
    return [pre, body, post];
};

export let mergeTemplate = (template: string, options: any, escape = '_'): string => {
    if (Object.keys(options).length === 0) return template;
    escape = ((escape || '__') + '__').substr(0, 2);
    // if (escape.length < 2) escape += escape;
    for (const option in options) {
      const val = options[option];
      if (val instanceof Array) {
        const key1 = escape[0] + option + escape[1];
        const key2 = escape[0] + '/' + option + escape[1];
        template = subMergeTemplate(template, key1, key2, val, escape);
        continue;
      }
      const key = escape[0] + option + escape[1];
      let p = template.indexOf(key);
      while (p > 0) {
        template = template.substr(0, p) + val + template.substr(p + key.length);
        p = template.indexOf(key);
      }
    }
    return template;
  };

  let subMergeTemplate = (template:string, key1:string, key2:string, val:Array<string>, escape:string):string => {
    let pre, body, post;
    [pre, body, post] = partition(template, key1, key2);
    if (body.length == 0)
       return pre;
    let result = pre;
    for (const i in val) {
      const part = val[i];
      result += mergeTemplate(body, part, escape);
    }
    return result + subMergeTemplate(post, key1, key2, val, escape);
  }

const hasRefs = (line: string): boolean => {
  return line.indexOf('<_host_//') >= 0;
};

const escape = (line: string): string => {
  return line.replace('<', '&lt;').replace('>', '&gt;');
};

const makeRefs = (template: string): string => {
  let p = template.indexOf('<_host_');
  let pre = '';
  let post = template;
  while (p >= 0) {
    pre += post.substr(0, p);
    post = post.substr(p);
    const p2 = post.indexOf('>');
    if (p2 >= 0) {
      const link = post.substr(1, p2 - 1);
      pre += '<a href=\'' + link + '\'>&lt;' + link + '&gt;</a>';
      post = post.substr(p2 + 1);
    } else {
      pre += post;
      return pre;
    }
    p = post.indexOf('<_host_');
  }
  return pre + post;
};

export let toHtml = (template: string): string => {
  const lines = template.split('\n');
  let result = '';
  for (let line of lines) {
     if (hasRefs(line))
       line = makeRefs(line);
     else
       line = escape(line);
     result += ((result.length > 0) ? '<br>' : '') + line.replace(' ', '&nbsp;');
  }
  return result;
};

export let makeId = (cnt: number, mark: string = 'M' ): string => {
  const n = `${cnt}`;
  let s = `${mark}0000`;
  s = s.substring(0, Math.max(0, s.length - n.length)) + n;
  // const s = util.format('M%i', cnt ) ;
  return s;
};
