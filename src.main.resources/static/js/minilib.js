// minilib
// prototype mini version By XiongJun.
// Since 2007.
// Current: CYLAN.



var minilib = {
	emptyFunction: function() {},
	Version: 'minilib-1.0b',
	pageParams: null,
	
	Try: function() {
		var returnValue;
		for (var i = 0, length = arguments.length; i < length; i++) {
			var lambda = arguments[i];
			try {
			returnValue = lambda();
			break;
		} catch (e) {}
		}
		return returnValue;
	},
	
	createClass: function() {
		return function() {
			this.initialize.apply(this, arguments);
		}
	},
	
	dumpError: function(e, memo) {
		alert("Error: " + e.message + "\n" +
			  "Addtional: " + memo);
	},
	
	parsePageParam: function() {
		this.pageParams = new Object;
		var parts = document.location.href.split("?");
		if (parts.length == 1) return;
		var params = parts[1].split("&");
		var pair;
		for (var i = 0; i < params.length; i++) {
			pair = params[i].split("=");
			if (pair.length > 1) {
				this.pageParams[pair[0]] = pair[1];
			}
		}
	}
};

Object.extend = function(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
}

Object.extend(Object, {
  inspect: function(object) {
    try {
      if (object === undefined) return 'undefined';
      if (object === null) return 'null';
      return object.inspect ? object.inspect() : object.toString();
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  },

  keys: function(object) {
    var keys = [];
    for (var property in object)
      keys.push(property);
    return keys;
  },

  values: function(object) {
    var values = [];
    for (var property in object)
      values.push(object[property]);
    return values;
  },

  clone: function(object) {
    return Object.extend({}, object);
  }
});

Function.prototype.bind = function() {
  var __method = this, args = $A(arguments), object = args.shift();
  return function() {
    return __method.apply(object, args.concat($A(arguments)));
  }
}

var Hash = function(obj) {
  Object.extend(this, obj || {});
};

var $A = Array.from = function(iterable) {
  if (!iterable) return [];
  if (iterable.toArray) {
    return iterable.toArray();
  } else {
    var results = [];
    for (var i = 0, length = iterable.length; i < length; i++)
      results.push(iterable[i]);
    return results;
  }
}

function element() {
	this.hide = function(){this.style.display="none"};
	this.show = function(){this.style.display=""};
}


function $(elementID) {
	var n = typeof elementID == "string" ? document.getElementById(elementID) : elementID;
	if (n == null)
		n = typeof elementID == "string" ? document.getElementsByName(elementID)[0] : elementID;
	if(n != null)
	  element.apply(n);
	return n;
}


/*--------------------------------------------------------------------------*/
Namespace = new Object();
Namespace.register = function(fullNS) {
    var nsArray = fullNS.split('.');
    var sEval = "";
    var sNS = "";
    for (var i = 0; i < nsArray.length; i++) {
        if (i != 0) sNS += ".";
        sNS += nsArray[i];
        sEval += "if (typeof(" + sNS + ") == 'undefined') " + sNS + " = new Object();"
    }
    if (sEval != "") eval(sEval);
}
/*--------------------------------------------------------------------------*/

xjAjax = minilib.createClass();
xjAjax.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];
xjAjax.prototype = {
	url: '',			// req url
	trans: null,		// transport
	options: {},

	initialize: function(url, params) {
		this.trans = this.getTransport();
		this.setOptions(params);
		this.request(url);
	},
	
	request: function(url) {	
		this.url = url;
		this.method = this.options.method;
		var params = this.options.parameters;
		// when GET, append parameters to URL
		if (this.method == 'GET' && params)
		  this.url += (this.url.indexOf('?') > -1 ? '&' : '?') + params;
		
		try {	
			this.trans.open(this.method, this.url, this.options.asynchronous);
			//if (this.options.asynchronous)
				//setTimeout(this.respondToReadyState.bind(this, [1]), 10);
			this.trans.onreadystatechange = this.onStateChange.bind(this, []);
			this.setRequestHeaders();
			var body = this.method == 'POST' ? (this.options.postBody || params) : null;
			this.trans.send(body);
			//alert(this.trans.responseText);
			/* Force Firefox to handle ready state 4 for synchronous requests */
			if (!this.options.asynchronous && this.transport.overrideMimeType)
				this.onStateChange();
		}
		catch (e) {
			 this.dispatchException(e);
		}
	},
	
	onStateChange: function() {
		var readyState = this.trans.readyState;
		if (readyState > 1 && !((readyState == 4) && this._complete))
			this.respondToReadyState(this.trans.readyState);
	},
	
	respondToReadyState: function(readyState) {
		var state = xjAjax.Events[readyState];
		var transport = this.trans;
		if (state == 'Complete') {
		try {
			this._complete = true;
			(this.options['on' + this.trans.status]
			 || this.options['on' + (this.success() ? 'Success' : 'Failure')]
			 || Prototype.emptyFunction)(this.trans, this.options.cbparam);
		} catch (e) {
			this.dispatchException(e);
		}
		
		}
		
		try {
		  (this.options['on' + state] || minilib.emptyFunction)(this.trans, this.options.cbparam);
		} catch (e) {
		  this.dispatchException(e);
		}
		
		if (state == 'Complete') {
		  // avoid memory leak in MSIE: clean up
		  this.trans.onreadystatechange = minilib.emptyFunction;
		}
	},
	
	setOptions: function(opts) {
		this.options = {
		  method:       'POST',
		  asynchronous:  true,
		  contentType:  'application/x-www-form-urlencoded',
		  encoding:     'UTF-8',
		  parameters:   '',
		  cbparam:	''
		}
		Object.extend(this.options, opts || {});		
		this.options.method = this.options.method.toUpperCase();
	},

	  setRequestHeaders: function() {
		var headers = {
		  'X-Requested-With': 'XMLHttpRequest',
		  'X-MiniLib-Version': minilib.Version,
		  'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
		  'If-Modified-Since': '0'
		};

		if (this.method == 'POST') {
		  headers['Content-type'] = this.options.contentType +
			(this.options.encoding ? '; charset=' + this.options.encoding : '');
	
		  /* Force "Connection: close" for older Mozilla browsers to work
		   * around a bug where XMLHttpRequest sends an incorrect
		   * Content-length header. See Mozilla Bugzilla #246651.
		   */
		  if (this.trans.overrideMimeType &&
			  (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
				headers['Connection'] = 'close';
		}
	
		// user-defined headers
		if (typeof this.options.requestHeaders == 'object') {
		  var extras = this.options.requestHeaders;
	
		  if (typeof extras.push == 'function')
			for (var i = 0, length = extras.length; i < length; i += 2)
			  headers[extras[i]] = extras[i+1];
		  else
			$H(extras).each(function(pair) { headers[pair.key] = pair.value });
		}
	
		for (var name in headers) {
			if (typeof headers[name] != 'function')
				this.trans.setRequestHeader(name, headers[name]);
		}
	  },

	getTransport: function() {
		return minilib.Try(
			function() {return new XMLHttpRequest()},
			function() {return new ActiveXObject('Msxml2.XMLHTTP')},
			function() {return new ActiveXObject('Microsoft.XMLHTTP')}
			) || false;
	},
	
	dispatchException: function(exception) {
		(this.options.onException || minilib.emptyFunction)(this, exception);
		//Ajax.Responders.dispatch('onException', this, exception);
	}
}




/*--------------------------------------------------------------------------*/

if (!window.Element)
  var Element = new Object();

Element.extend = function(element) {
	
  if (!element || _nativeExtensions || element.nodeType == 3) return element;

  if (!element._extended && element.tagName && element != window) {
    var methods = Object.clone(Element.Methods), cache = Element.extend.cache;

    if (element.tagName == 'FORM')
      Object.extend(methods, Form.Methods);
    if ((element.tagName == 'INPUT') ||
		(element.tagName == 'TEXTAREA') ||
		(element.tagName == 'SELECT'))
		//['INPUT', 'TEXTAREA', 'SELECT'].include(element.tagName))
      Object.extend(methods, Form.Element.Methods);

    Object.extend(methods, Element.Methods.Simulated);

    for (var property in methods) {
      var value = methods[property];
      //if (typeof value == 'function' && !(property in element))
	  if (typeof value == 'function')	// changed by chris
        element[property] = cache.findOrStore(value);
    }
  }

  element._extended = true;
  return element;
};

Element.extend.cache = {
  findOrStore: function(value) {
    return this[value] = this[value] || function() {
      return value.apply(null, [this].concat($A(arguments)));
    }
  }
};

Element.Methods = {
  visible: function(element) {
    return $(element).style.display != 'none';
  },

  toggle: function(element) {
    element = $(element);
    Element[Element.visible(element) ? 'hide' : 'show'](element);
    return element;
  },

  hide: function(element) {
    $(element).style.display = 'none';
    return element;
  },

  show: function(element) {
    $(element).style.display = '';
    return element;
  },

  remove: function(element) {
    element = $(element);
    element.parentNode.removeChild(element);
    return element;
  },

  update: function(element, html) {
    html = typeof html == 'undefined' ? '' : html.toString();
    $(element).innerHTML = html.stripScripts();
    setTimeout(function() {html.evalScripts()}, 10);
    return element;
  },

  replace: function(element, html) {
    element = $(element);
    html = typeof html == 'undefined' ? '' : html.toString();
    if (element.outerHTML) {
      element.outerHTML = html.stripScripts();
    } else {
      var range = element.ownerDocument.createRange();
      range.selectNodeContents(element);
      element.parentNode.replaceChild(
        range.createContextualFragment(html.stripScripts()), element);
    }
    setTimeout(function() {html.evalScripts()}, 10);
    return element;
  },

  inspect: function(element) {
    element = $(element);
    var result = '<' + element.tagName.toLowerCase();
    $H({'id': 'id', 'className': 'class'}).each(function(pair) {
      var property = pair.first(), attribute = pair.last();
      var value = (element[property] || '').toString();
      if (value) result += ' ' + attribute + '=' + value.inspect(true);
    });
    return result + '>';
  },

  recursivelyCollect: function(element, property) {
    element = $(element);
    var elements = [];
    while (element = element[property])
      if (element.nodeType == 1)
        elements.push(Element.extend(element));
    return elements;
  },

  ancestors: function(element) {
    return $(element).recursivelyCollect('parentNode');
  },

  descendants: function(element) {
    return $A($(element).getElementsByTagName('*'));
  },

  immediateDescendants: function(element) {
    if (!(element = $(element).firstChild)) return [];
    while (element && element.nodeType != 1) element = element.nextSibling;
    if (element) return [element].concat($(element).nextSiblings());
    return [];
  },

  previousSiblings: function(element) {
    return $(element).recursivelyCollect('previousSibling');
  },

  nextSiblings: function(element) {
    return $(element).recursivelyCollect('nextSibling');
  },

  siblings: function(element) {
    element = $(element);
    return element.previousSiblings().reverse().concat(element.nextSiblings());
  },

  match: function(element, selector) {
    if (typeof selector == 'string')
      selector = new Selector(selector);
    return selector.match($(element));
  },

  up: function(element, expression, index) {
    return Selector.findElement($(element).ancestors(), expression, index);
  },

  down: function(element, expression, index) {
    return Selector.findElement($(element).descendants(), expression, index);
  },

  previous: function(element, expression, index) {
    return Selector.findElement($(element).previousSiblings(), expression, index);
  },

  next: function(element, expression, index) {
    return Selector.findElement($(element).nextSiblings(), expression, index);
  },

  getElementsBySelector: function() {
    var args = $A(arguments), element = $(args.shift());
    return Selector.findChildElements(element, args);
  },

  getElementsByClassName: function(element, className) {
    return document.getElementsByClassName(className, element);
  },

  readAttribute: function(element, name) {
    element = $(element);
    if (document.all && !window.opera) {
      var t = Element._attributeTranslations;
      if (t.values[name]) return t.values[name](element, name);
      if (t.names[name])  name = t.names[name];
      var attribute = element.attributes[name];
      if(attribute) return attribute.nodeValue;
    }
    return element.getAttribute(name);
  },

  getHeight: function(element) {
    return $(element).getDimensions().height;
  },

  getWidth: function(element) {
    return $(element).getDimensions().width;
  },

  classNames: function(element) {
    return new Element.ClassNames(element);
  },

  hasClassName: function(element, className) {
    if (!(element = $(element))) return;
    var elementClassName = element.className;
    if (elementClassName.length == 0) return false;
    if (elementClassName == className ||
        elementClassName.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))
      return true;
    return false;
  },

  addClassName: function(element, className) {
    if (!(element = $(element))) return;
    Element.classNames(element).add(className);
    return element;
  },

  removeClassName: function(element, className) {
    if (!(element = $(element))) return;
    Element.classNames(element).remove(className);
    return element;
  },

  toggleClassName: function(element, className) {
    if (!(element = $(element))) return;
    Element.classNames(element)[element.hasClassName(className) ? 'remove' : 'add'](className);
    return element;
  },

  observe: function() {
    Event.observe.apply(Event, arguments);
    return $A(arguments).first();
  },

  stopObserving: function() {
    Event.stopObserving.apply(Event, arguments);
    return $A(arguments).first();
  },

  // removes whitespace-only text node children
  cleanWhitespace: function(element) {
    element = $(element);
    var node = element.firstChild;
    while (node) {
      var nextNode = node.nextSibling;
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
        element.removeChild(node);
      node = nextNode;
    }
    return element;
  },

  empty: function(element) {
    return $(element).innerHTML.match(/^\s*$/);
  },

  descendantOf: function(element, ancestor) {
    element = $(element), ancestor = $(ancestor);
    while (element = element.parentNode)
      if (element == ancestor) return true;
    return false;
  },

  scrollTo: function(element) {
    element = $(element);
    var pos = Position.cumulativeOffset(element);
    window.scrollTo(pos[0], pos[1]);
    return element;
  },

  getStyle: function(element, style) {
    element = $(element);
    if (['float','cssFloat'].include(style))
      style = (typeof element.style.styleFloat != 'undefined' ? 'styleFloat' : 'cssFloat');
    style = style.camelize();
    var value = element.style[style];
    if (!value) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        var css = document.defaultView.getComputedStyle(element, null);
        value = css ? css[style] : null;
      } else if (element.currentStyle) {
        value = element.currentStyle[style];
      }
    }

    if((value == 'auto') && ['width','height'].include(style) && (element.getStyle('display') != 'none'))
      value = element['offset'+style.capitalize()] + 'px';

    if (window.opera && ['left', 'top', 'right', 'bottom'].include(style))
      if (Element.getStyle(element, 'position') == 'static') value = 'auto';
    if(style == 'opacity') {
      if(value) return parseFloat(value);
      if(value = (element.getStyle('filter') || '').match(/alpha\(opacity=(.*)\)/))
        if(value[1]) return parseFloat(value[1]) / 100;
      return 1.0;
    }
    return value == 'auto' ? null : value;
  },

  setStyle: function(element, style) {
    element = $(element);
    for (var name in style) {
      var value = style[name];
      if(name == 'opacity') {
        if (value == 1) {
          value = (/Gecko/.test(navigator.userAgent) &&
            !/Konqueror|Safari|KHTML/.test(navigator.userAgent)) ? 0.999999 : 1.0;
          if(/MSIE/.test(navigator.userAgent) && !window.opera)
            element.style.filter = element.getStyle('filter').replace(/alpha\([^\)]*\)/gi,'');
        } else if(value == '') {
          if(/MSIE/.test(navigator.userAgent) && !window.opera)
            element.style.filter = element.getStyle('filter').replace(/alpha\([^\)]*\)/gi,'');
        } else {
          if(value < 0.00001) value = 0;
          if(/MSIE/.test(navigator.userAgent) && !window.opera)
            element.style.filter = element.getStyle('filter').replace(/alpha\([^\)]*\)/gi,'') +
              'alpha(opacity='+value*100+')';
        }
      } else if(['float','cssFloat'].include(name)) name = (typeof element.style.styleFloat != 'undefined') ? 'styleFloat' : 'cssFloat';
      element.style[name.camelize()] = value;
    }
    return element;
  },

  getDimensions: function(element) {
    element = $(element);
    var display = $(element).getStyle('display');
    if (display != 'none' && display != null) // Safari bug
      return {width: element.offsetWidth, height: element.offsetHeight};

    // All *Width and *Height properties give 0 on elements with display none,
    // so enable the element temporarily
    var els = element.style;
    var originalVisibility = els.visibility;
    var originalPosition = els.position;
    var originalDisplay = els.display;
    els.visibility = 'hidden';
    els.position = 'absolute';
    els.display = 'block';
    var originalWidth = element.clientWidth;
    var originalHeight = element.clientHeight;
    els.display = originalDisplay;
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return {width: originalWidth, height: originalHeight};
  },

  makePositioned: function(element) {
    element = $(element);
    var pos = Element.getStyle(element, 'position');
    if (pos == 'static' || !pos) {
      element._madePositioned = true;
      element.style.position = 'relative';
      // Opera returns the offset relative to the positioning context, when an
      // element is position relative but top and left have not been defined
      if (window.opera) {
        element.style.top = 0;
        element.style.left = 0;
      }
    }
    return element;
  },

  undoPositioned: function(element) {
    element = $(element);
    if (element._madePositioned) {
      element._madePositioned = undefined;
      element.style.position =
        element.style.top =
        element.style.left =
        element.style.bottom =
        element.style.right = '';
    }
    return element;
  },

  makeClipping: function(element) {
    element = $(element);
    if (element._overflow) return element;
    element._overflow = element.style.overflow || 'auto';
    if ((Element.getStyle(element, 'overflow') || 'visible') != 'hidden')
      element.style.overflow = 'hidden';
    return element;
  },

  undoClipping: function(element) {
    element = $(element);
    if (!element._overflow) return element;
    element.style.overflow = element._overflow == 'auto' ? '' : element._overflow;
    element._overflow = null;
    return element;
  }
};

Object.extend(Element.Methods, {childOf: Element.Methods.descendantOf});

Element._attributeTranslations = {};

Element._attributeTranslations.names = {
  colspan:   "colSpan",
  rowspan:   "rowSpan",
  valign:    "vAlign",
  datetime:  "dateTime",
  accesskey: "accessKey",
  tabindex:  "tabIndex",
  enctype:   "encType",
  maxlength: "maxLength",
  readonly:  "readOnly",
  longdesc:  "longDesc"
};

Element._attributeTranslations.values = {
  _getAttr: function(element, attribute) {
    return element.getAttribute(attribute, 2);
  },

  _flag: function(element, attribute) {
    return $(element).hasAttribute(attribute) ? attribute : null;
  },

  style: function(element) {
    return element.style.cssText.toLowerCase();
  },

  title: function(element) {
    var node = element.getAttributeNode('title');
    return node.specified ? node.nodeValue : null;
  }
};

Object.extend(Element._attributeTranslations.values, {
  href: Element._attributeTranslations.values._getAttr,
  src:  Element._attributeTranslations.values._getAttr,
  disabled: Element._attributeTranslations.values._flag,
  checked:  Element._attributeTranslations.values._flag,
  readonly: Element._attributeTranslations.values._flag,
  multiple: Element._attributeTranslations.values._flag
});

Element.Methods.Simulated = {
  hasAttribute: function(element, attribute) {
    var t = Element._attributeTranslations;
    attribute = t.names[attribute] || attribute;
    return $(element).getAttributeNode(attribute).specified;
  }
};

// IE is missing .innerHTML support for TABLE-related elements
if (document.all && !window.opera){
  Element.Methods.update = function(element, html) {
    element = $(element);
    html = typeof html == 'undefined' ? '' : html.toString();
    var tagName = element.tagName.toUpperCase();
    if (['THEAD','TBODY','TR','TD'].include(tagName)) {
      var div = document.createElement('div');
      switch (tagName) {
        case 'THEAD':
        case 'TBODY':
          div.innerHTML = '<table><tbody>' +  html.stripScripts() + '</tbody></table>';
          depth = 2;
          break;
        case 'TR':
          div.innerHTML = '<table><tbody><tr>' +  html.stripScripts() + '</tr></tbody></table>';
          depth = 3;
          break;
        case 'TD':
          div.innerHTML = '<table><tbody><tr><td>' +  html.stripScripts() + '</td></tr></tbody></table>';
          depth = 4;
      }
      $A(element.childNodes).each(function(node){
        element.removeChild(node)
      });
      depth.times(function(){ div = div.firstChild });

      $A(div.childNodes).each(
        function(node){ element.appendChild(node) });
    } else {
      element.innerHTML = html.stripScripts();
    }
    setTimeout(function() {html.evalScripts()}, 10);
    return element;
  }
};

Object.extend(Element, Element.Methods);

var _nativeExtensions = false;
/*
if(/Konqueror|Safari|KHTML/.test(navigator.userAgent))
 ['', 'Form', 'Input', 'TextArea', 'Select'].each(function(tag){
    var className = 'HTML' + tag + 'Element';
    if(window[className]) return;
    var klass = window[className] = {};
    klass.prototype = document.createElement(tag ? tag.toLowerCase() : 'div').__proto__;
  });
*/
Element.addMethods = function(methods) {
  Object.extend(Element.Methods, methods || {});

  function copy(methods, destination, onlyIfAbsent) {
    onlyIfAbsent = onlyIfAbsent || false;
    var cache = Element.extend.cache;
    for (var property in methods) {
      var value = methods[property];
      //if (!onlyIfAbsent || !(property in destination))
	  if (!onlyIfAbsent) // changed by chris
        destination[property] = cache.findOrStore(value);
    }
  }

  if (typeof HTMLElement != 'undefined') {
    copy(Element.Methods, HTMLElement.prototype);
    copy(Element.Methods.Simulated, HTMLElement.prototype, true);
    copy(Form.Methods, HTMLFormElement.prototype);
    [HTMLInputElement, HTMLTextAreaElement, HTMLSelectElement].each(function(klass) {
      copy(Form.Element.Methods, klass.prototype);
    });
    _nativeExtensions = true;
  }
}

var Toggle = new Object();
Toggle.display = Element.toggle;


/*--------------------------------------------------------------------------*/

var Form = {
  reset: function(form) {
    $(form).reset();
    return form;
  },

  serializeElements: function(elements, getHash) {
    var data = elements.inject({}, function(result, element) {
      if (!element.disabled && element.name) {
        var key = element.name, value = $(element).getValue();
        if (value != undefined) {
          if (result[key]) {
            if (result[key].constructor != Array) result[key] = [result[key]];
            result[key].push(value);
          }
          else result[key] = value;
        }
      }
      return result;
    });

    return getHash ? data : Hash.toQueryString(data);
  }
};

Form.Methods = {
  serialize: function(form, getHash) {
    return Form.serializeElements(Form.getElements(form), getHash);
  },

  getElements: function(form) {
    return $A($(form).getElementsByTagName('*')).inject([],
      function(elements, child) {
        if (Form.Element.Serializers[child.tagName.toLowerCase()])
          elements.push(Element.extend(child));
        return elements;
      }
    );
  },

  getInputs: function(form, typeName, name) {
    form = $(form);
    var inputs = form.getElementsByTagName('input');

    if (!typeName && !name) return $A(inputs).map(Element.extend);

    for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
      var input = inputs[i];
      if ((typeName && input.type != typeName) || (name && input.name != name))
        continue;
      matchingInputs.push(Element.extend(input));
    }

    return matchingInputs;
  },

  disable: function(form) {
    form = $(form);
    form.getElements().each(function(element) {
      element.blur();
      element.disabled = 'true';
    });
    return form;
  },

  enable: function(form) {
    form = $(form);
    form.getElements().each(function(element) {
      element.disabled = '';
    });
    return form;
  },

  findFirstElement: function(form) {
    return $(form).getElements().find(function(element) {
      return element.type != 'hidden' && !element.disabled && 
	  ((element.tagName.toLowerCase() == 'input')  ||
		(element.tagName.toLowerCase() == 'select')  ||
		(element.tagName.toLowerCase() == 'textarea'))
    });
  },

  focusFirstElement: function(form) {
    form = $(form);
    form.findFirstElement().activate();
    return form;
  }
}

Object.extend(Form, Form.Methods);

/*--------------------------------------------------------------------------*/

Form.Element = {
  focus: function(element) {
    $(element).focus();
    return element;
  },

  select: function(element) {
    $(element).select();
    return element;
  }
}

Form.Element.Methods = {
  serialize: function(element) {
    element = $(element);
    if (!element.disabled && element.name) {
      var value = element.getValue();
      if (value != undefined) {
        var pair = {};
        pair[element.name] = value;
        return Hash.toQueryString(pair);
      }
    }
    return '';
  },

  getValue: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
	if (element.tagName == 'SELECT')
	{
		return element.options[element.selectedIndex].value;
	}
    return Form.Element.Serializers[method](element);
  },

  clear: function(element) {
    $(element).value = '';
    return element;
  },

  present: function(element) {
    return $(element).value != '';
  },

  activate: function(element) {
    element = $(element);
    element.focus();
    if (element.select && ( element.tagName.toLowerCase() != 'input' ||
		(element.type == 'button' ||
		 element.type == 'reset' ||
		 element.type == 'submit')))
      element.select();
    return element;
  },

  disable: function(element) {
    element = $(element);
    element.disabled = true;
    return element;
  },

  enable: function(element) {
    element = $(element);
    element.blur();
    element.disabled = false;
    return element;
  }
}

Object.extend(Form.Element, Form.Element.Methods);
var Field = Form.Element;
var $F = Form.Element.getValue;

/*--------------------------------------------------------------------------*/

Form.Element.Serializers = {
  input: function(element) {
    switch (element.type.toLowerCase()) {
      case 'checkbox':
      case 'radio':
        return Form.Element.Serializers.inputSelector(element);
      default:
        return Form.Element.Serializers.textarea(element);
    }
  },

  inputSelector: function(element) {
    return element.checked ? element.value : null;
  },

  textarea: function(element) {
    return element.value;
  },

  select: function(element) {
    return this[element.type == 'select-one' ?
      'selectOne' : 'selectMany'](element);
  },

  selectOne: function(element) {
    var index = element.selectedIndex;
    return index >= 0 ? this.optionValue(element.options[index]) : null;
  },

  selectMany: function(element) {
    var values, length = element.length;
    if (!length) return null;

    for (var i = 0, values = []; i < length; i++) {
      var opt = element.options[i];
      if (opt.selected) values.push(this.optionValue(opt));
    }
    return values;
  },

  optionValue: function(opt) {
    // extend element because hasAttribute may not be native
    return Element.extend(opt).hasAttribute('value') ? opt.value : opt.text;
  }
}
/************************************************************************
    Array extend
*************************************************************************/
function removeIndex(array, index) {
    var removed = false;
	if (index >= array.length)
		return;
	
    for (var i = index + 1, n = index; i < array.length; i++, n++) {
		array[n] = array[i];
    }
    array.length--;
}

function RemoveArray(array, attachId) {
	var olen = array.length;
	var removed = false;
    for (var i = 0, n = 0; i < array.length; i++) {
        if (array[i] == attachId) {
			removed = true;
		} else {
            array[n++]=array[i];
		}
	}
	if (removed) array.length = olen - 1;
}

Array.prototype.remove = function(obj) {
    return RemoveArray(this, obj);
}

Array.prototype.getpos = function(val) {
    for(var i=0;i<this.length;i++) {
        if(this[i]==val) {
			return i;
			break;
        }
	}
    return -1;
}

Array.prototype.insert = function(obj) {
    for(var i=0;i<this.length;i++) {
        if(this[i]==obj) {
			return false;
			break;
        }
    }
	this.push(obj);
    return true;
}

String.prototype.applyTemplate = function(obj) {
	var str = this;
	for (key in obj) {
		var reg = new RegExp("%" + key + "%", "g");
		str = str.replace(reg, obj[key]);
		reg = null;
	}
	return str;
}

// make date like "2007-1-1" to "2007-01-01"
String.prototype.regularDate = function(spliter) {
	if (arguments.length == 0)
		spliter = "-";
	var ds = this.split(spliter);
	if (ds[1].length == 1) ds[1] = '0' + ds[1];
	if (ds[2].length == 1) ds[2] = '0' + ds[2];
	var nd = ds[0] + spliter + ds[1] + spliter + ds[2];
	return nd;
}

/*--------------------------------------------------------------------------*/
xjAjaxQueue = minilib.createClass();
xjAjaxQueue.prototype = {
	url:        '',
	reqs:       new Array,
	onFinish:   minilib.emptyFunction,
	start:      false,
	reqCnt:     0,
  
	initialize: function() {    
	},   
  
	dispatchRequest: function(index) {
		try {
			var f = this.reqs[index].exec;
			(f || minilib.emptyFunction)(this.reqs[index].trans);
			this.reqs[index] = null;
			this.reqCnt--;
			if (this.start || this.reqCnt == 0) { 
				this.dispatch();
			}    
		} catch(e) {
			minilib.dumpError(e, "dispatchRequest");
		}    
	},   
  
	addRequest: function(param, func, url, options) {
		try {
			var opts = {
				onComplete: '',
				parameters: ''
			}    
			opts = Object.extend(opts, options || {}); 
			opts.onComplete = this.dispatchRequest.bind(this, [this.reqs.length]);
			opts.parameters = param || "";
			var myAjax = new xjAjax(url || this.url, opts);
			myAjax.exec = func || minilib.dumpError();
			this.reqs.push(myAjax);
			this.reqCnt ++;
		} catch(e) {
			minilib.dumpError(e);
		}
	},
	
	dispatch: function() {
		this.start = true;
		if (this.reqCnt == 0) {
			(this.onFinish || minilib.emptyFunction)();
			this.start = false;
		}
	}
}

/*--------------------------------------------------------------------------*/
speedTester = minilib.createClass();
speedTester.prototype = {
	TIMEOUT:		Math.pow(2, 32) - 1,
	timeout_ms:		10000,
	current:		-1,
	callback: 		null,
	timer:			new Array,
	url:			new Array,
	events:			new Array,
	timeout_events:	new Array,
	
	initialize: function(callback, urls, timeout) {
		this.callback		= callback;
		this.url			= this.url.concat(urls);
		this.timeout_ms		= typeof(timeout) == 'number' ? timeout : 10000;
		this.runNextTest();
	},
	
	runNextTest: function() {
		this.current++;
		if (this.current < this.url.length)
			this.runTest(this.current);		
	},
	
	runTest: function(index) {
		var e 		= document.createElement('iframe');
		var now		= new Date();
		this.timer.push(now.getTime());
		this.events.push(this.onComplete.bind(this, index));

		e.style.display = 'none';
		e.id			= 'xj_speed_tester' + index;
		if (window.attachEvent) {
			e.attachEvent('onload', this.events[index]);
		} else {
			e.addEventListener('load', this.events[index], false);
		}
		
		e.src = this.url[index] + '?cache=' + Math.random();
		document.body.appendChild(e);
		this.timeout_events.push(
			setTimeout(this.killer.bind(this, [index]), this.timeout_ms)
		);
	},
	
	killer: function(index) {
		var e = $('xj_speed_tester' + index);
		if (window.detachEvent) {
			e.detachEvent('onload', 
						  this.events[index]);
		} else {
			e.removeEventListener('load', 
								  this.events[index], 
								  false);
		}
		this.onComplete(index, true);
	},
	
	onComplete: function(index, timeout) {
		var now	 = new Date();
		if (arguments.length > 1 && timeout == true) {
			(this.callback || minilib.emptyFunction)
				(index, this.TIMEOUT);
		} else {
			clearTimeout(this.timeout_events[index]);
			(this.callback || minilib.emptyFunction)
				(index, now.getTime() - this.timer[index]);
		}
		this.runNextTest();
	}
}
