

/**
* returns the form element for a given field element.
* @param  element fieldElm
* @return element (form element)
* @throws bool false
* @since  bs-4.6
*/
function bsFormGetFormForField(fieldElm) {
	if (document.forms.length == 1) return document.forms[0]; //optimization
	if (fieldElm.tagName == 'form') return fieldElm;
	if (fieldElm.parentNode) return bsFormGetFormForField(fieldElm.parentNode);
	return false;
}

/**
* returns the next form field, if any.
* @param  element fieldElm
* @return element (field element)
* @throws bool false (error or none)
* @since  bs-4.6
*/
function bsFormGetNextField(fieldElm) {
	var formElm = bsFormGetFormForField(fieldElm);
	if (!formElm) return false;
	var useNext = false;
	for (var i=0; i<formElm.elements.length; i++) {
		if (useNext) return formElm.elements[i];
		if (formElm.elements[i] == fieldElm) useNext = true;
	}
	return false;
}

/**
* form utility functions.
* 
* @author     andrej arn <andrej-at-blueshoes-dot-org>
* @package    javascript_core
* @subpackage form
*/
function bsFormToggleCheckbox(formName, fieldName) {
	try {
	  if (document.forms[formName].elements[fieldName].checked) {
  	  document.forms[formName].elements[fieldName].checked = false;
	  } else {
  	  document.forms[formName].elements[fieldName].checked = true;
	  }
	} catch (e) {
		//never mind, maybe field not there in this case.
	}
}

function bsFormToggleContainer(containerName) {
	if (document.getElementById) {
		var elm = document.getElementById(containerName);
		if (typeof(elm) != 'undefined') {
			elm.style.display = (elm.style.display == 'none') ? 'block' : 'none';
			
			var img = document.getElementById('contToggleImg' + containerName.substr(9));
			if (typeof(img) != 'undefined') {
				if (elm.style.display == 'none') {
					img.src = img.src.substr(0, img.src.length -6) + 'down.gif';
				} else {
					img.src = img.src.substr(0, img.src.length -8) + 'up.gif';
				}
			}
			
			var txtO = document.getElementById('contToggleTextO' + containerName.substr(9));
			var txtC = document.getElementById('contToggleTextC' + containerName.substr(9));
			if (typeof(txtO) != 'undefined') {
				if (elm.style.display == 'none') {
					txtO.style.display = 'inline';
					txtC.style.display = 'none';
				} else {
					txtO.style.display = 'none';
					txtC.style.display = 'inline';
				}
			}
			
			return;
		}
	}
	if (document.all) {
	  if (document.all[containerName].style.display == "none") {
	    document.all[containerName].style.display = "block";
	  } else {
	    document.all[containerName].style.display = "none";
	  }
	}
}

/**
* @param  string formName
* @param  string fieldName
* @param  object fieldElement (eg text field)
* @return void
*/
function bsFormCheckOnlyIf(formName, fieldName, fieldElement) {
	//alert(fieldName);
	
	if (typeof(bsFormVars) == 'undefined') return;
	if (typeof(bsFormVars[formName]) == 'undefined') return;
	
	for (var otherFieldName in bsFormVars[formName]) {
		//alert(otherFieldName);
		if (typeof(bsFormVars[formName][otherFieldName]['onlyIf']) == 'undefined') continue;
		var status = _bsForm_anyIfCase(bsFormVars[formName][otherFieldName]['onlyIf']);
		//alert(status);
		
		var elm = document.getElementById(otherFieldName);
		if ((typeof(elm) != 'undefined') && (elm != null)) {
	    if (!status) { //in this case we need the negation. mustIf is different to onlyIf.
				//alert('error onlyIf: ' + otherFieldName);
				elm.disabled = true;
	    } else {
				//alert('ok onlyIf: ' + otherFieldName);
				elm.disabled = false;
			}
		}
	}
	//if (typeof(bsFormVars['formName']['fieldName']) == 'undefined') return;
	//if (typeof(bsFormVars['formName']['fieldName']['onlyIf']) == 'undefined') return;
	/*
	bsForm['bsUserForm']['toAddress']['onlyIf'] = new Array();
	bsForm['bsUserForm']['toAddress']['onlyIf'][0] = new Array();
	bsForm['bsUserForm']['toAddress']['onlyIf'][0]['operator'] = "|";
	bsForm['bsUserForm']['toAddress']['onlyIf'][0]['field'] = "toAddressType";
	bsForm['bsUserForm']['toAddress']['onlyIf'][0]['compare'] = "=";
	bsForm['bsUserForm']['toAddress']['onlyIf'][0]['value'] = "hard";
	*/
	//var a = bsFormVars['formName']['fieldName']['onlyIf'];
	/*
	for (var i=0; i<a.length; i++) {
		if (typeof(a[i]['operator']) == 'undefined') a[i]['operator'] = '|';
		if (typeof(a[i]['compare'])  == 'undefined') a[i]['compare']  = '=';
		if (typeof(a[i]['value'])    == 'undefined') a[i]['value']    = true;
	}
	*/
}


/**
* returns the value of the form field specified.
* works for select and radio fields too. used with the Bs_Form package.
* @param  string elementID
* @return mixed
*/
function bsFormGetFieldValue(elementID) {
	var elm  = document.getElementById(elementID);
	//alert(elementID);
	//alert(elm);
	if ((typeof(elm) == 'undefined') || (elm == null) || (elm.id != elementID)) {
		var elm  = document.getElementById(elementID + '0');
		var elm2 = document[elm.form.name][elm.name];
		elm = elm2;
	} else {
		var elm2 = document[elm.form.name][elm.name];
	}
	
	//alert('x ' + elementID);
	//alert(elm2[0].value);
	//alert(elm2.selectedIndex);
	/*
	if (typeof(elm2.options) != 'undefined') {
		if (elm2.selectedIndex != null) {
			return elm2.options[elm2.selectedIndex].value;
		}
		return null;
	}
	*/
		//radio
		for (var i=0; i<elm2.length; i++) {
			if (elm2[i].checked) return elm2[i].value;
		}
	return elm.value;
}

/**
* used for mustIf, onlyIf and mustOneOfIf case. that's where the (method) name anyIf comes from.
* @access private
* @param  array (object var mustIf, onlyIf or mustOneOfIf, so look there.)
* @return bool TRUE if it evaluates to TRUE, FALSE otherwise.
*/
function _bsForm_anyIfCase(myIf) {
  if ((typeof(myIf) == 'object') && (myIf.length > 0)) {
		var stack = new Array();
		for (i=0; i<myIf.length; i++) {
			stack[i] = new Array();
      stack[i]['operator'] = (typeof(myIf[i]['operator']) != 'undefined') ? myIf[i]['operator'] : '|';
      stack[i]['compare']  = (typeof(myIf[i]['compare'])  != 'undefined') ? myIf[i]['compare']  : '=';
      stack[i]['boolean']  = false; //default, fallback.
      do { // try block
        if (typeof(myIf[i]['value']) != 'undefined') {
          var t = bsFormGetFieldValue(myIf[i]['field']);
					//alert(t);
					//alert(myIf[i]['value']);
          if (typeof(t) != null) {
            switch (stack[i]['compare']) {
              case '=':
                stack[i]['boolean'] = (t == myIf[i]['value']);
                break;
              case '>':
                stack[i]['boolean'] = (t > myIf[i]['value']);
                break;
              case '<':
                stack[i]['boolean'] = (t < myIf[i]['value']);
                break;
              case '>=':
                stack[i]['boolean'] = (t >= myIf[i]['value']);
                break;
              case '<=':
                stack[i]['boolean'] = (t <= myIf[i]['value']);
                break;
              case '!=':
              case '<>': //not documented but one might type it.
                stack[i]['boolean'] = (t != myIf[i]['value']);
                break;
								/*
								//not supported here in js
              case 's': //soundex equal
                stack[i]['boolean'] = (soundex(t) == soundex(myIf[i]['value']));
                break;
              case '!s': //not soundex equal
                stack[i]['boolean'] = (soundex(t) != soundex(myIf[i]['value']));
                break;
								*/
              default:
                //murphy! don't do anything, keep the default which is FALSE.
            }
            break;
          }
        } else {
          //stack[i]['boolean'] = $this->_form->isFieldFilledIn($myIf[$k]['field']); //converting to bool cause it could be NULL.
          break;
        }
      } while (false);
    }
    
    if ((typeof(stack) == 'object') && (stack.length > 0)) {
      var evalStr = '';
			for (var i=0; i<stack.length; i++) {
        if (i > 0) evalStr += (stack[i]['operator'] == '&') ? '&& ' : '|| ';
        evalStr += (stack[i]['boolean']) ? 'true ' : 'false ';
      }
      //evalStr = 'return (' + evalStr + ');';
      evalStr = ' (' + evalStr + ');';
      //alert(evalStr); //4debug
      //our evalStr string now looks like "return (true && true || false || true);"
      if (eval(evalStr)) {
        return true;
      }
    }
  }
  return false;
}


/**
* on-the-fly client/server check for email addresses
* @param string url (the url to submit to)
* @param object fieldObj (html input field)
* @param int checkType (what to check, 1 2 or 3, see php code)
* @see Bs_FormFieldEmail.class.php
*/
function bsFormCheckMail(url, fieldObj, checkType) {
  var fieldName = fieldObj.name;
  var fieldID   = fieldObj.id;
  var email     = fieldObj.value;
  var iFrameObj = document.getElementById('bsMailCheck' + fieldName);
  url += "?email=" + email + "&checkType=" + checkType;
  var zeit = new Date();
  url += "&random=" + zeit.getMilliseconds(); //no url-cache please.
  //alert(url); //4debug
  iFrameObj.src = url;
}

/**
* sets the focus into the first field that was not filled in correctly.
* if param doSelect is true: also selects all the content of that field. 
* @param  string fieldName
* @param  string formName
* @param  bool   $doSelect (see above)
* @return void
*/
function bsFormJumpToFirstError(fieldName, formName, doSelect) {
	try {
	  if (document.forms[formName].elements[fieldName]) {
	    if (doSelect && (document.forms[formName].elements[fieldName].value != '')) {
	      if (document.forms[formName].elements[fieldName].select) {
	        //do all fields support the select() method? dunno. let's check it.
	        document.forms[formName].elements[fieldName].select();
	      }
	    }
	    if (document.forms[formName].elements[fieldName].focus) {
	      //eg select fields don't support the focus() method.
	      document.forms[formName].elements[fieldName].focus();
	    }
	  }
	} catch (e) {
		//happens for example if field is not visible because the container is closed. 
		//or with spiecial fields. never mind. it was worth a try.
	}
}


/**
* submits the form on hitting enter.
* note: ie would not need the params, only netscape needs them.
* example call: bsEnterSubmit(event,this.form);
* @param object ev     (event object)
* @param object myForm (form object)
* @return bool true (or void if it submits the form.)
*/
function bsFormEnterSubmit(ev, myForm) {
  var ev = ('object' == typeof(window.event)) ? window.event : ev;  //1st is for ie, 2nd for ns
  if (ev && ev.keyCode == 13) {
    //this.form.submit();
    myForm.submit();
  }
  return true;
}

/**
* stops the form from being submitted.
* note: ie would not need the param, only mozilla needs it.
* example call: bsNoEnter(event);
* @param object ev (event object)
* @return bool (false to avoid a form submit, true if enter was not hit.)
*/
function bsFormNoEnter(ev) {
	if (typeof(ev) == 'undefined') ev = window.event;
  //var ev = ('object' == typeof(window.event)) ? window.event : ev;  //1st is for ie, 2nd for ns
  if (ev) return (ev.keyCode != 13);
  return true;
}

/**
* stops the form from being submitted and sets the focus to the next field.
* 
* note: ie would not need the param e, only netscape needs it.
* 
* example call: bsNoEnter(event);
* @param  object ev (event object)
* @return bool
*/
function bsFormEnterToTab(ev) {
  ev = ('object' == typeof(window.event)) ? window.event : ev;  //1st is for ie, 2nd for ns
  if ((ev && (ev.keyCode == 13)) || (ev.which && (ev.which == 13))) {
		if ((typeof(ie) == 'undefined') || ie) {
			//overwriting the keycode only works in ie. 
			ev.keyCode = 9;
		} else {
			//this code works, but mozilla still submits. bummer. all the scripts on the web 
			//fail as well. i hope they fix it ... the return false is ignored. 
			//i see a solution by modifying the submit buttons. but it's work for the webmaster. 
			//so drop it. 
			
			var nextField = bsFormGetNextField(ev.srcElement);
			if (nextField) {
				try {
					nextField.focus(); //.select()
				} catch (e) {
					//never mind, maybe not a field. 
				}
			}
			return false;
		}
	}
  return true; //important for all cases.
}

/**
* fires the function functionName if enter was pressed.
* @param  object ev (event object)
* @return mixed (return value of functionName (that should be bool) if the function gets executed, bool true otherwise.)
*/
function bsFormHandleEnter(ev, functionName) {
  var ev = ('object' == typeof(window.event)) ? window.event : ev;  //1st is for ie, 2nd for ns
  if (ev && ev.keyCode == 13) {
    //call function
		return eval(functionName + '();');
  }
  return true; //important for all cases.
}


/**
* 
* example usage: you have a form field, and onMouseOver you want the field to 
*                be active (focus) and the content selected. but if the focus 
*                is already there, you don't want that. that's why the 2nd 
*                param (force) is here.
* 
* @param  mixed field (field id or field object
* @param  bool force (if set to true then it will be done even if the focus is already there.)
* @return bool (true on success, false on failure)
* @todo looks like the force thingie does not work. behaves like it's always set to true.
*/
function bsFormFieldSetFocusAndSelect(field, force) {
  if (typeof(field) == 'string') {
    field = document.getElementById(field);
  }
  if (!field) return false;
  
  try {
    if (force || !field.hasFocus) {
      field.focus();
      field.select();
    }
  } catch (e) {
    return false;
  }
  return true;
}


/**
* decrypts all form field values needed.
* @param  string formName
* @param  string passPhraze
* @return void
* @dependencies javascript/core/crypt/Bs_Rc4Crypt.lib.js
*/
function rc4encryptFormValues(formName, passPhraze) {
	for(var i=0;i<document[formName].length;++i) {
		var elm = document[formName].elements[i];
		if (typeof(elm.name) == 'undefined') continue;
		if (elm.name.substr(0, 8) == 'bs_form[') continue;
		if ((typeof(elm.value) != 'undefined') && (typeof(elm.value) != 'object') && (elm.value != '')) {
			switch (elm.type) {
				case 'text':
				case 'password':
				case 'hidden':
					elm.value = '_crp_' + base64_encode(rc4crypt(passPhraze, elm.value));
					break;
			}
		}
	}
}
/**
* alias for rc4encryptFormValues() to have an innocent function name.
*/
function flowerPower1(formName, passPhraze) {
	rc4encryptFormValues(formName, passPhraze);
}
/**
* decrypts all form field values needed.
* @param  string formName
* @param  string passPhraze
* @return void
* @dependencies javascript/core/crypt/Bs_Rc4Crypt.lib.js
*/
function rc4decryptFormValues(formName, passPhraze) {
	for(var i=0;i<document[formName].length;++i) {
		var elm = document[formName].elements[i];
		if ((typeof(elm.value) != 'undefined') && (elm.value != '') && (elm.value.substr(0, 5) == '_crp_')) {
			elm.value = rc4crypt(passPhraze, base64_decode(elm.value.substr(5)));
			//elm.value = rc4(_bs_form_foo, elm.value.substr(5));
			//elm.value = base64ToText(elm.value.substr(5));
		}
	}
}
/**
* alias for rc4decryptFormValues() to have an innocent function name.
*/
function flowerPower2(formName, passPhraze) {
	rc4decryptFormValues(formName, passPhraze);
}


/**
* Creates a HTML form dynamically from the given data and submits it to the server.
* 
* 'ToDo'-Philosophy of BlueShoes. See also Bs_ToDo.lib.php
*   When designing pages that interact with the user (UI-pages), we need some standard 
*   structure to pass the information back to the server and making it available to the running
*   PHP functions in a GLOBAL way. 
*   When following the 'ToDo'-Philosophy of BlueShoes you should be able to get the 'ToDo'-hash 
*   from anywhere in your code and you don't have to setup your own sturcture and peal the 
*   data out of PHP's global $_REQUEST. We intend support the 'ToDo'-Philosophy throughout BlueShoes.
*
* We try to standarize the return values. 
*
* Note; The dataHash can have any depth! Sample
*       var hash = new Array();
*           hash['markets'] = new Array();
*           hash['markets']['012389'] = 2.5 
*           hash['markets']['014359'] = 1.5 
*                       : 
*           hash['sortCriteria'];
*           hash['sortCriteria']['mt'] = 'ASC';
*                       :
*
* @param  string              exitScreen : The exit target (=this screen) we are leaving
* @param  string OR vector    exitAction : string or vector of strings. The action(s) to perform. (e.g. 'save'). Empty string if no-action
* @param  string              nextScreen : The next target (=next screen) to show
* @param  string OR vector    nextAction : string or vector of strings. The action(s) to perform. (e.g. 'sort').  Empty string if no-action
* @param  hash                dataHash   : Hash the may be needed for addition data (e.g. sort-criteria ). NULL if no-data
* @param  string              submitToAction : the url to submit the form to.
* @return no! does not return.
* @dependencies core/html/Bs_HtmlUtil.lib.js
*/
function bsFormDoHiddenSubmit(exitScreen, exitAction, nextScreen, nextAction, dataHash, submitToAction) {
  var formOutArray =  new Array();
  var ii=0;
  
  formOutArray[ii++] = '<form name="smSubmitForm" action="' + submitToAction + '" method="post">';
  
  // nextScreen and exitScreen are simple strings
  formOutArray[ii++] = '<input type="hidden" name="bs_todo[nextScreen]" value="' + nextScreen + '">';
  formOutArray[ii++] = '<input type="hidden" name="bs_todo[exitScreen]" value="' + exitScreen + '">';
  
  // nextAction and exitAction can be a simple string OR a vector of strings
  switch (typeof(nextAction)) {
    case 'string':
      formOutArray[ii++] = '<input type="hidden" name="bs_todo[nextAction]" value="' + nextAction + '">';
      break;
    case 'object':
      for (var key in nextAction) {
        formOutArray[ii++] = '<input type="hidden" name="bs_todo[nextAction][' + key + ']" value="' + nextAction[key] + '">';
      }
    default:
      // do nothing
  }
  switch (typeof(exitAction)) {
    case 'string':
      formOutArray[ii++] = '<input type="hidden" name="bs_todo[exitAction]" value="' + exitAction + '">';
      break;
    case 'object':
      for (var key in exitAction) {
        formOutArray[ii++] = '<input type="hidden" name="bs_todo[exitAction][' + key + ']" value="' + exitAction[key] + '">';
      }
    default:
      // do nothing
  }
  
	//dump(dataHash, false, false);
  dataHash = _recursiveObj2Hash(dataHash);
	//dump(dataHash, false, false);
	
  for (var matrixStr in dataHash) {
		if (typeof(dataHash[matrixStr]) == 'function') continue; //that makes no sense.
		
    var valStr = bs_filterForHtml(dataHash[matrixStr] + ''); //convert to string and filter.
    formOutArray[ii++] = '<input type="hidden" name="' + "bs_todo[dataHash]" + matrixStr + '" value="' + valStr +  '">';
  }
	//dump(formOutArray, false, false);
  
  formOutArray[ii++] = '</form>';
  
  var body = document.getElementsByTagName('body').item(0);
  body.innerHTML = formOutArray.join('');
  var form = document.smSubmitForm; 
  form.submit();

  //dump(formOutArray.join(''));
  //var body = document.getElementById('body');
  //body.insertAdjacentHTML('beforeEnd', formOutArray.join(''));
  //body.innerHTML = formOutArray.join('');
  //dump(f.innerHTML);
  //return;
  //document.mySubmitForm.submit();
}

/**
* Flaten an N-dimensional Hash (==JS-Object) 
* return is a hash of e.g.  ("[foo][bar]" => value)
*
* @param  aObject   JS-object     
* @param  matrixStr string (Only for internal use)    
* @param  matrixStr string (Only for internal use)
* @return a hash (see text above)
*/
function _recursiveObj2Hash(aObject, matrixStr, flatObjHash) {
  if (!flatObjHash) { // first call
    flatObjHash = new Object();
    matrixStr = '';
  }
  
  if (typeof(aObject) != 'object') {
    flatObjHash[matrixStr] = aObject;
  } else {
    for (var key in aObject) {
       var newMatrixStr = matrixStr + '['+key+']';
      _recursiveObj2Hash(aObject[key], newMatrixStr, flatObjHash);
    }
  }
  return flatObjHash;
}

