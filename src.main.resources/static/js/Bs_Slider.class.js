// The global array of objects that have been instanciated
if (!Bs_Objects) {var Bs_Objects = [];};


/**
* A Slider Component.
* 
* <b>Features:</b> 
* - IE6 and NS(Mozilla7) compliant.
* - Lets you add a slider to your page. It simulates a HTML-form text field; so your form-handling will not change.
* - You may use your customized images.
* - Able to attach onClick- and onChange-events to execute your JS-code when checked/changed.
* 
* <b>Includes (+Dependencies):</b>
* <code>
*   <script type="text/javascript" src="/_bsJavascript/lib/LibCrossBrowser.js"></script>
*   <script type="text/javascript" src="/_bsJavascript/lib/EventHandler.js"></script>
*   <script type="text/javascript" src="/_bsJavascript/core/form/Bs_FormUtil.lib.js"></script>
*   <script type="text/javascript" src="/_bsJavascript/components/slider/Bs_Slider.class.js"></script>
* </code>
* 
* <b>How to use:</b>
* 1. Have a look at the example (see example link below)
* 2. Create a function in the HTML-header called init(). Place the javascript code 
*    that instanciates and inits this component into init().
* 3. Place an 'onLoad' in your body-tag: e.g. <body onLoad="init();">
* 4. In the HTML body: Place a div- or span-tag with an unique ID where you want the component to be.
* 
* <b>How it works:</b>
* - [After instanciating and initializing the object]. Call the drawInto([tag id]) method.
*   This will search the HTML code for a tag with the given id and insert HTML- and JS- code
*   dynamically (using DOM) to display the component and handle it.
* 
* <b>What is returned to the server:</b>
*<pre>
*  +------------------------+------------------------------------------------+
*  | [tag id] +"_value"     | int, The slider value                          |
*  +------------------------+------------------------------------------------+
* In versions 4.4 and before  
*  +--------------------------------------------+----------------------------+
*  | [varible name of the object] +"_value"     | int, The slider value      |
*  +--------------------------------------------+----------------------------+
*</pre>
*  This class generates a normal HTML text field and saves it's state in there.
*  It's not visible because it is set to display:none (invisible) but (when used in a form),
*  it will be submitted like any other HTML-form-field. To override this name see {@link fieldname}.
* 
* <b>Event-Handling</b>: (see {@link attachOnClick()}, {@link attachOnChange()})
* - You can a callback function for certain events onto this component
*   (events are things like onClick, onChange ... aso) 
* 
* Snippet 1) Attaching a callback function:
* <code>
*     var mySlider = new Bs_Slider();
*     mySlider.attachOnChange(yourCallbackFunctionName);
* </code>
* The function you pass should be able to receive 3 parameters.
* - The componentObj is an instance of this class and allows you to access it the 
*   component that triggered the event.
* - newValue is the new value that was set, new position is the new position in pixels.
* <code>
*     function yourCallbackFunctionName(componentObj, newValue, newPosition) {
*       // do some stuff.
*     }
*     if you're using the 2-knob slider then there is a 4th param: knobNumber.
* </code>
* 
* <b>Customized images:</b>
* - Set the path to your image-dir {@link imgDir}
* - Then use following methods setup the colorbar and to place the images you intend to use:
* {@link colorbar} 
* {@link setBackgroundImage()} 
* {@link setSliderIcon()}
* {@link setArrowIconLeft()}, {@link setArrowIconRight()}
* 
* @example example1.html
* @example example2.html
* 
* @author     andrej arn <andrej-at-blueshoes-dot-org>, sam blum <sam-at-blueshoes-dot-org>
* @package    javascript_components
* @subpackage slider
* @copyright  blueshoes.org
*/
function Bs_Slider(theFieldnamePrefix) {
  
	/**
  * Unique Object/Tag ID is initialized in the constuctor.
  * Based on this._id. Can be used in genarated JS-code as ID. Is set together 
  * from the  classname + this._id (see _constructor() code ).
  *
  * @access private
  * @var  string 
  */
  this._objectId;
	
  /**
  * When submitting the form, you'll receive the value under this name.
	* In other words you'll receive the data back to the server as if you had placed <br>
  * <code><input type=text name="[the fieldName]" id="[the fieldName]"  value="[the value]"></code><br>
	* into your HTML-form.
  *
  * Note:
  * - If not set the field name will be genarated as instanceName +"_value"  
  * 
	* @access public
	* @var    string
	*/
	this.fieldName;
	this.fieldName2;
	
	/**
	* If the whole slider is disabled or not.
	* @access private
	* @var    bool
	* @see    setDisabled()
	*/
	this._disabled = false;	
	
	/**
	* The slider direction (horizontal/vertical)
  *<pre>
	*   0 = horizontally (default)
	*   1 = vertically (currently not implemented)
  *</pre>
	* @access public
	* @var    int direction
	* @todo   implement vertically
	*/
  this.direction       = 0;
	
	/**
	* The width of the sliding part in pixel.
  * Note: This is not the full width. It excludes the input field and the push buttons.
	* @access public
	* @var    int (default is 100 pixel)
	*/
  this.width           = 100;
	
	/**
	* The height of the sliding part in pixel. 
	* This is not the full height. it excludes the input field and the push buttons.
	* @access public
	* @var    int (default is 20 pixel)
	*/
  this.height          = 20;
	
	/**
	* The lowest possible value. It may be lower than 0 afaik :-)
	* @access public
	* @var    int (default is 0)
	*/
  this.minVal          = 0;
	
	/**
	* The highest possible value.
	* @access public
	* @var    int  (default is 100)
	*/
  this.maxVal          = 100;
	
	/**
	* The default value (when the slider gets initialized).
	* Note:
  * - Can initially have alower or higher value than minVal/maxVal.
  *   This is a feature. You can detect if the used has set any value this way.
  *   Only  values in the range of minVal - maxVal can be set and are displayed.
	* @access public
	* @var    int 
	*/
  this.valueDefault      = 0;
	
	/**
	* How much units to slide on an arrow click. 
	* If set to 0 then the arrows won't be displayed.
	* Something like 0.5 is possible as well.
	* @access public
	* @var    int  (default is 1)
	* @see    this.wheelAmount
	*/
  this.arrowAmount     = 1;
	
	/**
	* if activated then a mouseover is already enough for the arrow to fire. it then 
	* does not need a click. it continues to fire until onmouseout.
	* @access public
	* @var    bool arrowMouseOver
	* @since  bs-4.6
	* @see    var this.arrowKeepFiringTimeout
	*/
	this.arrowMouseOver = false;
	
	/**
	* every this milliseconds the onChangeByArrow() events keep firing.
	* set to 0 if you don't want that.
	* @access public
	* @var    int arrowKeepFiringTimeout
	*/
	this.arrowKeepFiringTimeout = 10;
	
	/**
	* @access private
	* @var    bool _stopFireArrowFlag
	* @see    this.stopFireArrow()
	*/
	this._stopFireArrowFlag = false;
  
	/**
	* how much to scroll when the mouse wheel is used.
	* note: the mouse wheel is supported by ie only (as of 2004/03). 
	* @access public
	* @var    int wheelAmount
	* @see    this.arrowAmount
	* @since  bs-4.6
	*/
	this.wheelAmount = 5;
	
	
  /**
  * If and how the colorbar feature should be used.
  * 
  * - If it's a string then it will be interpreted as a css class. 
  * 
  * - If it's an array (hash) (or object with vars) the keys will be used to 
	*   generate style settings. 
	*   You can achieve the same results using both ways, except for 'widthDifference'.
  * 
  * - You can use both (array with css class as elemenet of the array) to 
  *   set additional css properties. I can't think of any, but maybe you do.
  * <pre>
  * if you give it an array, it can have these settings:
  *   KEY               DEFAULT
  *   cssClass          -nothing-
  *   color             'orange' if cssClass is not set, otherwise -nothing-
  *   height            -nothing-
  *   widthDifference   0
  *   offsetLeft        -nothing-
  *   offsetTop         -nothing-
  * 
  * coments:
  *   color:
  *     if you don't see the colorbar, you prolly have a cssClass defined 
  *     but neither there a color defined not in the array ('color' element).
  *   widthDifference:
  *     the width of the colorbar is always from the left side to where the 
  *     handle (slider) is. so the left side of the slider bar is colored.
  *     it may be (depending on your design) that you need to have the color 
  *     bar a little bit larger or smaller. you can set an amound of pixels 
  *     here, it may even be negative.
  *   offsetLeft:
  *     if you use a cssclass, you can specify something like left:5px;
  *     if you use arrows, you have to take the width of the left arrow 
  *     into account. if you use offsetLeft, you don't. this is done for you.
  * </pre>
  * 
  * anyway play with the values until you get what you want.
  * 
  * So if you want to use a css class and want to specify a widthDifference, 
  * do something like 
  * <code>
  *   arr = new Array()
  *   arr['cssClass'] = 'yourClass';
  *   arr['widthDifference'] = -5;
  * </code>
  * and you're done.
  * 
  * On the other hand it's handy if you don't have to create a css class and make 
  * sure it always ships with your file. well, enough of comments for this one.
  * 
  * @access public
  * @var    mixed  (array or string)
  */
  this.colorbar;
  this.colorbar2;
  
	/**
	* The z-index the slider will use. you may want to change this if you have 
	* elements on your page that overlap this slider (floating stuff or so).
	* @access public
	* @var int  (default is 1000)
	*/
  this.baseZindex      = 1000;
	
	/**
	* If you want to move the whole slider object with everything on the x-axis 
	* then set a value here. 
	* - example: -5 means move the whole thing  5 pixel to the left.
	* - example: 10 means move the whole thing 10 pixel to the right.
	* @access public
	* @var    int 
	* @see    moveY
	* @since  bs4.3
	*/
	this.moveX = 0;
	
	/**
	* If you want to move the whole slider object with everything on the y-axis 
	* then set a value here. 
	* - example: -5 means move the whole thing  5 pixel up the page.
	* - example: 10 means move the whole thing 10 pixel down the page.
	* @access public
	* @var    int 
	* @see    moveX
	* @since  bs4.3
	*/
	this.moveY = 0;
  
	/**
	* The base path for the image folder.
  * @deprecated use imgDir
  * @access private
  */
  this.imgBasePath;

	/**
	* The base path for the image folder.
	* 
	* Examples: (NOTE: The path has to end with a slash.)
  * - 'http://www.domain.com/foo/'  <= with domain
	* - '/my/image/path/'             <= absolute path without domain
	* - '../some/path/'               <= relative path
	* 
	* 
	* Default is: '/_bsJavascript/components/slider/img/'
	* Check this folder and the other folders around there for other styles.
	* 
	* @access public
	* @var    string
	*/
  this.imgDir  = '/_bsJavascript/components/slider/img/';
	
	/**
	* The name of the background image in the imgDir.
	* Set this using setBackgroundImage(), so look there.
	* @access private
	* @var    string 
	* @see    setBackgroundImage()
	*/
  this._bgImgSrc;
		
	/**
	* How a background-image should be repeated. it's a css property.
	* - example: 'no-repeat'
	* set this using setBackgroundImage(), so look there.
	* @access private
	* @var    string 
	* @see    setBackgroundImage()
	*/
  this._bgImgRepeat;
  
	/**
	* Additional css style string for the background image.
	* set this using setBackgroundImage(), so look there.
	* @access private
	* @var    string 
	* @see    setBackgroundImage()
	*/
	this._bgImgCssStyle;
	
	
	/**
	* @access private
	* @var    string 
	* @see    setBackgroundImageLeft()
	*/
  this._bgImgLeftSrc;
	
	/**
	* @access private
	* @var    int 
	* @see    setBackgroundImageLeft()
	*/
  this._bgImgLeftWidth;
	
	/**
	* @access private
	* @var    int 
	* @see    setBackgroundImageLeft()
	*/
  this._bgImgLeftHeight;
	
	/**
	* @access private
	* @var    string 
	* @see    setBackgroundImageRight()
	*/
  this._bgImgRightSrc;
	
	/**
	* @access private
	* @var    int 
	* @see    setBackgroundImageRight()
	*/
  this._bgImgRightWidth;
	
	/**
	* @access private
	* @var    int 
	* @see    setBackgroundImageRight()
	*/
  this._bgImgRightHeight;
	
	
	/**
	* The slider handle image name. (knob)
	* Set this using setSliderIcon().
	* @access private 
	* @var    int 
	* @see    setSliderIcon(), _sliderImgWidth, _sliderImgHeight
	*/
  this._sliderImgSrc;
	
	/**
	* The width of the slider handle image.
	* Set this using setSliderIcon().
	* @access private
	* @var    int 
	* @see    setSliderIcon(), _sliderImgSrc, _sliderImgHeight
	*/
  this._sliderImgWidth;
	
	/**
	* The height of the slider handle image.
	* Set this using setSliderIcon().
	* @access private
	* @var    int _sliderImgHeight
	* @see    setSliderIcon(), _sliderImgSrc, _sliderImgWidth
	*/
  this._sliderImgHeight;
    
	/**
	* Used to set a CSS class name for the slider container.
	* @access public
	* @var    string
	*/
  this.styleContainerClass;
	
	/**
	* Used to set a CSS class name for the value input field.
	* @access public
	* @var    string 
	*/
  this.styleValueFieldClass  = 'smalltxt spanSliderField';
  this.styleValueFieldClass2 = 'smalltxt spanSliderField';
	
	/**
	* Used to set a CSS class name for the value text span.
	* @access public
	* @var    string 
	*/
  this.styleValueTextClass  = 'smalltxt spanSliderText';
  this.styleValueTextClass2 = 'smalltxt spanSliderText';
  
	/**
	* The background color. hex code or named color.
	* examples: 'blue', 'green', '#000000'
	* @access public
	* @var    string 
	*/
  this.bgColor;	
	
	/**
	* The name of the left arrow icon.
	* @access private
	* @var    string 
	* @see    setArrowIconLeft()
	*/
  this._arrowIconLeftSrc;
  
	/**
	* The width of the left arrow icon.
	* @access private
	* @var    string  
	* @see    setArrowIconLeft()
	*/
  this._arrowIconLeftWidth   = 0;
  
	/**
	* The height of the left arrow icon.
	* @access private
	* @var    string  
	* @see    setArrowIconLeft()
	*/
  this._arrowIconLeftHeight  = 0;
  
	/**
	* A CSS style string to use in the image tag.
	* @access private
	* @var    string arrowIconLeftCssStyle
	* @see    setArrowIconLeft()
	* @todo   all
	*/
  this._arrowIconLeftCssStyle  = 0;

	/**
	* The name of the right arrow icon.
	* @access private
	* @var    string
	* @see    setArrowIconRight()
	*/
  this._arrowIconRightSrc;
  
	/**
	* The width of the right arrow icon.
	* @access private
	* @var    int 
	* @see    setArrowIconRight()
	*/
  this._arrowIconRightWidth  = 0;
  
	/**
	* The height of the right arrow icon.
	* @access private
	* @var    int 
	* @see    setArrowIconRight()
	*/
  this._arrowIconRightHeight = 0;
    
	/**
	* A CSS style string to use in the image tag.
	* @access private
	* @var    string
	* @see    setArrowIconRight()
	* @todo   all
	*/
  this._arrowIconRightCssStyle  = 0;
	
  /**
  * The step (interval) of the values. 
  * <pre>
  * Examples: 0, 1, 2, 3 ...     has an interval of 1
  *           0, 0.5, 1, 1.5 ... has an interval of 0.5
  * </pre>
  * 
  * @access public
  * @var    number  (int or real, whatever)
  */
  this.valueInterval   = 1;
  this.valueInterval2  = 1;
  
  /**
  * Should we display the input field (with value) to the right? 
  * 
  * <pre>
  * 0 = no
  * 1 = show as text (not implemented yet, will be shown as #2)
  * 2 = show as input field (changable). this is the default.
  * 3 = show as text, onmouseover becomes an input field. 
  * </pre>
  * 
  * The trick is to keep it invisible if set to false. we need it because it's 
  * the holder of the internal value. could be recoded, if you want to...
  * 
  * @access public
  * @var int useInputField
  * @see inputTextFieldEvent
  */
  this.useInputField  = 2;
  this.useInputField2 = 2;
  
  /**
  * If {@link useInputField} is set to 3 we toggle. but when?
  * default is onMouseOver (over) but it can be set to 'click' 
  * (onClick). 
  * @access public
  * @var    string ('over' or 'click')
  * @see    useInputField
  */
  this.inputTextFieldEvent = 'over';
  
	
	/**
	* if a second knob should be used.
	* default is false.
	* @access public
	* @since  bs-4.6
	* @status experimental
	*/
	this.useSecondKnob;
	/**
	* if the 2nd value can be lower than the 1st, and vice versa.
	* per default value crossing is blocked.
	* @access public
	* @since  bs-4.6
	* @status experimental
	* @see    useSecondKnob
	*/
	this.preventValueCrossing;
	
  /**
	* ?
  * @access private
	*/
  this.ctrl;
  this.ctrl2;
  
  /**
  * The real value we have. 
  * in the beginning it will be set to this.valueDefault.
  * <b>WARNING:</b> 
  * - don't mix this._valueInternal and this.valueInterval. 
  *   it's not only that one is private and the other is not, 
  *   it's that one is the internal value, the other is the STEP.
  *   maybe step would have been a better name. got that?
  * @access private
  * @var    double 
  * @see    getValue()
  */
  this._valueInternal;
	this._valueInternal2;
	
  /**
  * How the slider should be seen in the browser
  * @access private
  * @var    int
  * @see    setDisplay()
  */
  this._display         = 2;
	
  /**#@+
  * Ids and objects
  * @access private
  */
	
  this._arrowLeftContainerId;
  this._arrowLeftContainerObj;
  this._arrowLeftIconId;
  this._arrowLeftIconObj;
  
  this._arrowRightContainerId;
  this._arrowRightContainerObj;
  this._arrowRightIconId;
  this._arrowRightIconObj;
	
  this._valueContainerId;
	this._valueContainerObj;

  this._handleId;
  this._handleObj;
  this._valueFieldId;
  this._valueFieldObj;
  this._valueFieldObj2;
  this._valueTextId;
  this._valueTextObj;
  this._valueTextObj2;
  this._slideBarId;
  this._slideBarObj;
  this._colorbarId;
  this._colorbarObj;
  this._colorbarObj2;
  /**#@-*/
  
  /**#@+
  * positions and measurements in pixels
  * @access private
  */
  this._posUpperLeftX;
  this._posUpperLeftY;
  this._posSlideStart;
  this._posSlideEnd;
  /**#@-*/
  
  /**
  * That's this.width - this._sliderImgWidth. Slide area without the handle.
  * If you don't get this, draw a slider yourself. maybe you'll 
  * figure it out then. :-)
  * @access private
  * @var int
  */
  this._slideWidth;
  
  
  //attached (assigned) event functions (that exist in the global scope):
  
  /**
  * Array holding all the information about attached events. 
  * The structure can be like these:
  * <pre>
  * 1. attach a function directly
  *    syntax:  _attachedEvents['eventName'] = yourFunctionName;
  * 2. attach some javascript code
  *    syntax:  _attachedEvents['eventName'] = "yourCode();";
  *    example: _attachedEvents['eventName'] = "alert('hi'); callSomething('foo');";
  *    just keep in mind that you cannot use vars in that code, because when it 
  *    gets executed that will be another scope (unless the vars are global...)
  * 3. attach multiple things for the same event
  *    syntax:  _attachedEvents['eventName']    = new Array;
  *             _attachedEvents['eventName'][0] = yourFunctionName;
  *             _attachedEvents['eventName'][1] = "yourCode();";
  *    possible values for 'eventName' are:
  *     'onChange'
  * </pre>
  * 
  * @access private
  * @var    array  (hash, see above)
  * @see    attachEvent();
  */
  this._attachedEvents;
  
  /**
  * Fires whenever the value changes. that can happen by sliding, 
  * hitting arrow buttons or typing in values into the input field.
  * @access private
  * @var function
  * @see attachOnChange()
  */
  this.eventOnChange;
  
  /**#@+
  * Attached function for the slide start,  move and end event.
  * @access private
  * @var function  
  */
  this.slideStartCB;
  this.slideMoveCB;
  this.slideEndCB;
  /**#@-*/
  
	/**
	* the pseudo constructor.
	* @access private
	* @return void
	*/
	this._constructor = function(theFieldnamePrefix) {
  	// Put this instance into the global object instance list
    this._id = Bs_Objects.length;
    Bs_Objects[this._id] = this; 
    this._objectId = "Bs_Slider_"+this._id;
    // For copatibillity we still init "objectName"
    this.objectName = this._objectId;
    // In V4.4 the fieldname used to be given by the constuctor-parameter. So if
    // a paramter is passed in the constructor, we still use it as fieldname prefix
    if (typeof(theFieldnamePrefix) == 'string') {
      this.fieldName  = theFieldnamePrefix + '_value';  
      this.fieldName2 = theFieldnamePrefix + '2_value';  
      this.objectName = theFieldnamePrefix;
    }
  }
  
  /**
  * Makes sure everything is ready to use. sets some default values if needed.
	* @access private
	* @return void
  */
  this._checkup = function() {
    if (typeof(this.minVal)     == 'undefined') this.minVal     = 0;
    if (typeof(this.maxVal)     == 'undefined') this.maxVal     = 10;
    if (typeof(this.valueDefault) == 'undefined') this.valueDefault = this.minVal;
    this._valueInternal = this.valueDefault;
		
		if (this.useSecondKnob) {
	    if (typeof(this.minVal2)     == 'undefined') this.minVal2     = 0;
	    if (typeof(this.maxVal2)     == 'undefined') this.maxVal2     = 10;
	    if (typeof(this.valueDefault2) == 'undefined') this.valueDefault2 = this.maxVal2;
	    this._valueInternal2 = this.valueDefault2;
    }
		
    // This is for backward compatabillity only --sam 2003-06
    if (typeof(this.imgBasePath) == 'string')  this.imgDir = this.imgBasePath;
  }
  
	
	/**
	* loads a skin by its name. 
	* 
	* you can do the same with manual calls to setSliderIcon() etc, but this is quick and easy.
	* 
	* available skins:
	*   
	* 
	* @access public
	* @param  string skinName
	* @return bool
	* @since  bs-4.6
	*/
	this.loadSkin = function(skinName) {
		switch (skinName) {
			case 'winxp':
			case 'winxp-scrollbar-horizontal':
			  this.useInputField = 0;
				this.height        = 16;
			  this.imgDir        = '/_bsJavascript/components/slider/img/winxp/';
			  this.setSliderIcon('horizontal_scrollbar_knob.gif', 17, 16);
			  this.setArrowIconLeft('horizontal_scrollbar_arrowLeft.gif', 17, 16);
			  this.setArrowIconRight('horizontal_scrollbar_arrowRight.gif', 17, 16);
				break;
			case 'winxp-scrollbar-vertical':
				this.direction     = 1;
			  this.useInputField = 0;
				this.width         = 16;
			  this.imgDir        = '/_bsJavascript/components/slider/img/winxp/';
			  this.setSliderIcon('vertical_scrollbar_knob.gif', 16, 17);
			  this.setArrowIconLeft('vertical_scrollbar_arrowUp.gif', 16, 17);
			  this.setArrowIconRight('vertical_scrollbar_arrowDown.gif', 16, 17);
				break;
			case 'osx':
			case 'osx-horizontal':
			  this.useInputField = 0;
				this.height        = 21;
			  this.imgDir        = '/_bsJavascript/components/slider/img/osx/';
			  this.setSliderIcon('horizontal_knob.gif', 17, 16);
			  this.setBackgroundImage('horizontal_background.gif', 'repeat');
			  this.setBackgroundImageLeft('horizontal_backgroundLeft.gif', 6, 21);
			  this.setBackgroundImageRight('horizontal_backgroundRight.gif', 6, 21);
				break;
			case 'osx-scrollbar-horizontal':
			  this.useInputField = 0;
				this.height        = 15;
			  this.imgDir        = '/_bsJavascript/components/slider/img/osx/';
			  this.setSliderIcon('horizontal_scrollbar_knobSmall.gif', 23, 15);
			  this.setBackgroundImage('horizontal_scrollbar_background.gif', 'repeat');
			  this.setArrowIconLeft('horizontal_scrollbar_arrowLeft.gif', 17, 15);
			  this.setArrowIconRight('horizontal_scrollbar_arrowRight.gif', 17, 15);
				break;
			case 'osx-scrollbar-vertical':
				this.direction     = 1;
			  this.useInputField = 0;
				this.width         = 15;
				this.imgDir        = '/_bsJavascript/components/slider/img/osx/';
			  this.setSliderIcon('vertical_scrollbar_knobSmall.gif', 15, 23);
			  this.setBackgroundImage('vertical_scrollbar_background.gif', 'repeat');
			  this.setArrowIconLeft('vertical_scrollbar_arrowUp.gif', 15, 17);
			  this.setArrowIconRight('vertical_scrollbar_arrowDown.gif', 15, 17);
				break;
			case 'os9':
			case 'os9-horizontal':
			  this.useInputField = 0;
				this.height        = 16;
			  this.imgDir        = '/_bsJavascript/components/slider/img/os9/';
			  this.setSliderIcon('horizontal_scrollbar_knob.gif', 17, 16);
			  this.setBackgroundImage('horizontal_scrollbar_background.gif', 'repeat');
			  this.setArrowIconLeft('horizontal_scrollbar_arrowLeft.gif', 16, 16);
			  this.setArrowIconRight('horizontal_scrollbar_arrowRight.gif', 16, 16);
				break;
			case 'os9-vertical':
				this.direction     = 1;
			  this.useInputField = 0;
				this.width         = 16;
			  this.imgDir        = '/_bsJavascript/components/slider/img/os9/';
			  this.setSliderIcon('vertical_scrollbar_knob.gif', 16, 17);
			  this.setBackgroundImage('vertical_scrollbar_background.gif', 'repeat');
			  this.setArrowIconLeft('vertical_scrollbar_arrowUp.gif', 16, 16);
			  this.setArrowIconRight('vertical_scrollbar_arrowDown.gif', 16, 16);
				break;
			case 'opera7':
			case 'opera7-horizontal':
			  this.useInputField = 0;
				this.height        = 16;
			  this.imgDir        = '/_bsJavascript/components/slider/img/opera7/';
			  this.setSliderIcon('horizontal_knob.gif', 19, 16);
			  this.setBackgroundImage('horizontal_background.gif', 'repeat');
			  this.setArrowIconLeft('horizontal_arrowLeft.gif', 16, 16);
			  this.setArrowIconRight('horizontal_arrowRight.gif', 16, 16);
				break;
			case 'opera7-vertical':
				this.direction     = 1;
			  this.useInputField = 0;
				this.width         = 16;
			  this.imgDir        = '/_bsJavascript/components/slider/img/opera7/';
			  this.setSliderIcon('vertical_knob.gif', 16, 19);
			  this.setBackgroundImage('vertical_background.gif', 'repeat');
			  this.setArrowIconLeft('vertical_arrowUp.gif', 16, 16);
			  this.setArrowIconRight('vertical_arrowDown.gif', 16, 16);
				break;
			case 'bob':
			case 'bob-horizontal':
				this.height        = 18;
			  this.imgDir        = '/_bsJavascript/components/slider/img/bob/';
			  this.setBackgroundImage('background.gif', 'no-repeat');
			  this.setSliderIcon('slider.gif', 13, 18);
			  //this.setArrowIconLeft('arrowLeft.gif', 16, 16);
			  //this.setArrowIconRight('arrowRight.gif', 16, 16);
			  this.colorbar = new Object();
			  this.colorbar['color']           = 'blue';
			  this.colorbar['height']          = 5;
			  this.colorbar['widthDifference'] = 0; //-12
			  this.colorbar['offsetLeft']      = 5;
			  this.colorbar['offsetTop']       = 9;
				break;
			case 'burp':
			case 'burp-horizontal':
			  this.useInputField = 0;
				this.height        = 11;
			  this.imgDir        = '/_bsJavascript/components/slider/img/burp/';
			  this.setSliderIcon('horizontal_knob.gif', 5, 11);
			  this.setBackgroundImage('horizontal_background.gif', 'repeat');
			  this.setArrowIconLeft('horizontal_arrowLeft.gif', 10, 11);
			  this.setArrowIconRight('horizontal_arrowRight.gif', 10, 11);
				break;
			case 'burp-vertical':
				this.direction     = 1;
			  this.useInputField = 0;
				this.width         = 11;
			  this.imgDir        = '/_bsJavascript/components/slider/img/burp/';
			  this.setSliderIcon('vertical_knob.gif', 11, 5);
			  this.setBackgroundImage('vertical_background.gif', 'repeat');
			  this.setArrowIconLeft('vertical_arrowUp.gif', 11, 10);
			  this.setArrowIconRight('vertical_arrowDown.gif', 11, 10);
				break;
			case 'ximian-industrial':
			case 'ximian-industrial-horizontal':
			  this.useInputField = 0;
				this.height        = 15;
			  this.imgDir        = '/_bsJavascript/components/slider/img/ximian_industrial/';
			  this.setSliderIcon('horizontal_knob.gif', 31, 15);
			  this.setBackgroundImage('horizontal_background.gif', 'repeat');
			  this.setArrowIconLeft('horizontal_arrowLeft.gif', 15, 15);
			  this.setArrowIconRight('horizontal_arrowRight.gif', 15, 15);
				break;
			case 'ximian-industrial-vertical':
				this.direction     = 1;
			  this.useInputField = 0;
				this.width         = 15;
			  this.imgDir        = '/_bsJavascript/components/slider/img/ximian_industrial/';
			  this.setSliderIcon('vertical_knob.gif', 15, 31);
			  this.setBackgroundImage('vertical_background.gif', 'repeat');
			  this.setArrowIconLeft('vertical_arrowUp.gif', 15, 15);
			  this.setArrowIconRight('vertical_arrowDown.gif', 15, 15);
				break;
			case 'smoothstreak':
			case 'smoothstreak-horizontal':
			  this.useInputField = 0;
				this.height        = 15;
			  this.imgDir        = '/_bsJavascript/components/slider/img/smoothstreak/';
			  this.setSliderIcon('horizontal_knob.gif', 31, 15);
			  this.setBackgroundImage('horizontal_background.gif', 'repeat');
			  this.setBackgroundImageLeft('horizontal_backgroundLeft.gif', 2, 15);
			  this.setBackgroundImageRight('horizontal_backgroundRight.gif', 2, 15);
			  this.colorbar = new Object();
			  this.colorbar['color']           = '#736D6B';
			  this.colorbar['height']          = 11;
			  this.colorbar['widthDifference'] = 0;
			  this.colorbar['offsetLeft']      = 0;
			  this.colorbar['offsetTop']       = 2;
				break;
			case 'smoothstreak-vertical':
				this.direction     = 1;
			  this.useInputField = 0;
				this.width         = 15;
			  this.imgDir        = '/_bsJavascript/components/slider/img/smoothstreak/';
			  this.setSliderIcon('vertical_knob.gif', 15, 31);
			  this.setBackgroundImage('vertical_background.gif', 'repeat');
			  this.setBackgroundImageLeft('vertical_backgroundTop.gif', 15, 2);
			  this.setBackgroundImageRight('vertical_backgroundBottom.gif', 15, 2);
				break;
			case 'aluminumalloyvolcanic':
			case 'aluminumalloyvolcanic-horizontal':
			  this.useInputField = 0;
				this.height        = 15;
			  this.imgDir        = '/_bsJavascript/components/slider/img/aluminumalloyvolcanic/';
			  this.setSliderIcon('horizontal_knob.gif', 15, 19);
			  this.setBackgroundImage('horizontal_background.gif', 'repeat');
			  this.setBackgroundImageLeft('horizontal_backgroundLeft.gif', 2, 19);
			  this.setBackgroundImageRight('horizontal_backgroundRight.gif', 2, 19);
				break;
			case 'yattacier3':
			case 'yattacier3-horizontal':
			  this.useInputField = 0;
				this.height        = 16;
			  this.imgDir        = '/_bsJavascript/components/slider/img/yattacier3/';
			  this.setSliderIcon('horizontal_knob.gif', 30, 16);
			  this.setBackgroundImage('horizontal_background.gif', 'repeat');
			  this.setBackgroundImageLeft('horizontal_backgroundLeft.gif', 1, 16);
			  this.setBackgroundImageRight('horizontal_backgroundRight.gif', 1, 16);
				break;
			case 'h2ogtk2':
			case 'h2ogtk2-horizontal':
			  this.useInputField = 0;
				this.height        = 17;
			  this.imgDir        = '/_bsJavascript/components/slider/img/h2ogtk2/';
			  this.setSliderIcon('horizontal_knob.gif', 30, 17);
			  this.setBackgroundImage('horizontal_background.gif', 'repeat');
			  this.setBackgroundImageLeft('horizontal_backgroundLeft.gif', 7, 17);
			  this.setBackgroundImageRight('horizontal_backgroundRight.gif', 7, 17);
				break;
			case 'h2ogtk2-scrollbar-horizontal':
			  this.useInputField = 0;
				this.height        = 17;
			  this.imgDir        = '/_bsJavascript/components/slider/img/h2ogtk2/';
			  this.setSliderIcon('horizontal_knob.gif', 30, 17);
			  this.setBackgroundImage('horizontal_background.gif', 'repeat');
			  this.setArrowIconLeft('horizontal_arrowLeft.gif', 15, 17);
			  this.setArrowIconRight('horizontal_arrowRight.gif', 15, 17);
				break;
			default:
				return false;
		}
		return true;
	}
	
	
	/**
	* Render function.
	* @access public
	* @param  string tagId (ID of the element in that we render the slider.)
	* @return void
	*/
  this.render = function(tagId) {
    this._checkup();
    
    this._containerId           = 'co'   + tagId;
    this._handleId              = 'po'   + tagId;
    this._arrowLeftContainerId  = 'alc'  + tagId;
    this._arrowLeftIconId       = 'ali'  + tagId;
    this._arrowRightContainerId = 'arc'  + tagId;
    this._arrowRightIconId      = 'ari'  + tagId;
    this._valueContainerId      = 'vc'   + tagId;
    this._valueFieldId          = 'vf'   + tagId;
		if (typeof(this.fieldName)  == 'undefined') this.fieldName  = tagId + '_value';
		if (typeof(this.fieldName2) == 'undefined') this.fieldName2 = tagId + '2_value';
    this._valueTextId           = 'vt'   + tagId;
    this._slideBarId            = 'bar'  + tagId;
    this._colorbarId            = 'cb'   + tagId;
    
    var divWidth      = this.width; // + this._sliderImgWidth;
    var divHeight     = this.height;
    //var completeWidth = this.width + this._arrowIconLeftWidth + this._arrowIconRightWidth + this._sliderImgWidth +15; //15 just to add some space.
    
    var out         = new Array();
    var outI        = 0;
    var localOffset = 0;
    
    //container begin
    out[outI++] = '<div id="' + this._containerId + '"';
    if (this.styleContainerClass) {
      out[outI++] = ' class="' + this.styleContainerClass + '"';
    }
    out[outI++] = ' style="position:relative;';
    if (this._display == 0) {
      out[outI++] = ' display:none;';
    } else if (this._display == 1) {
      out[outI++] = ' visibility:hidden;';
    }
    out[outI++] = ' onmousewheel="Bs_Objects['+this._id+'].onMouseWheel(); return false;"';
    out[outI++] = '">';
    
		out[outI++] = '<div';
    out[outI++] = ' onmousewheel="Bs_Objects['+this._id+'].onMouseWheel(); return false;"';
		out[outI++] = ' style="position:absolute; left:' + this.moveX + '; top:' + this.moveY + ';">';
		
		if (this.useSecondKnob) {
			out[outI++] = this._renderInputFieldAndText(localOffset, 1);
			if (this['useInputField'] != 0) {
				localOffset += 35;
			}
		}
		
		//knob
    out[outI++] = '<div style="position:absolute; display:none; z-index:' + (this.baseZindex + 10) + ';" id="' + this._handleId     + '">';
    out[outI++] = '<img name="poImg' + tagId + '" src="' + this.imgDir + this._sliderImgSrc + '" border=0 width=' + this._sliderImgWidth + ' height=' + this._sliderImgHeight + '>';
    out[outI++] = '</div>';
    
		//knob 2
		if (this.useSecondKnob) {
	    out[outI++] = '<div style="position:absolute; display:none; z-index:' + (this.baseZindex + 9) + ';" id="' + this._handleId     + '2">';
  	  out[outI++] = '<img name="poImg' + tagId + '2" src="' + this.imgDir + this._sliderImgSrc2 + '" border=0 width=' + this._sliderImgWidth2 + ' height=' + this._sliderImgHeight2 + '>';
    	out[outI++] = '</div>';
		}
    
    //arrow left
    if ((this.arrowAmount > 0) && this._arrowIconLeftSrc) {
      out[outI++] = '<div id="' + this._arrowLeftContainerId + '" style="position:absolute; left:' + localOffset + '; top:0;">';
			out[outI++] = '<a href="javascript:void(false);"';
			if (this.arrowMouseOver) {
				out[outI++] = ' onMouseOver="Bs_Objects['+this._id+'].onChangeByArrow(false, true); return false;"';
				out[outI++] = ' onMouseOut="Bs_Objects['+this._id+'].stopFireArrow(); return false;"';
			} else {
				//old code:
				//out[outI++] = ' onClick="Bs_Objects['+this._id+'].onChangeByArrow(false); return false;"';
				//new code:
				out[outI++] = ' onMouseDown="Bs_Objects['+this._id+'].onChangeByArrow(false, true); return false;"';
				out[outI++] = ' onMouseUp="Bs_Objects['+this._id+'].stopFireArrow(); return false;"';
				out[outI++] = ' onMouseOut="Bs_Objects['+this._id+'].stopFireArrow(); return false;"';
			}
			out[outI++] = '>';
			out[outI++] = '<img id="' + this._arrowLeftIconId + '" src="' + this.imgDir + this._arrowIconLeftSrc + '" border="0" width="' + this._arrowIconLeftWidth + '" height="' + this._arrowIconLeftHeight + '"';
			if (typeof(this.arrowIconLeftCssStyle) != 'undefined') {
				out[outI++] = ' style="' + this.arrowIconLeftCssStyle + '"';
			}
			out[outI++] = '>';
			out[outI++] = '</a></div>';
      localOffset += this._arrowIconLeftWidth;
    }
    
		//left background image
		if (typeof(this._bgImgLeftSrc) != 'undefined') {
			var tmpLeft = (this.direction == 0) ? localOffset : 0;
			var tmpTop  = (this.direction == 0) ? 0           : localOffset;
			out[outI++] = '<div style="position:absolute; left:' + tmpLeft + '; top:' + tmpTop + ';">';
			out[outI++] = '<img src="' + this.imgDir + this._bgImgLeftSrc + '" width="' + this._bgImgLeftWidth + '" height="' + this._bgImgLeftHeight + '" border="0">';
			out[outI++] = '</div>';
			localOffset += (this.direction == 0) ? this._bgImgLeftWidth : this._bgImgLeftHeight;
		}
		
    //colorbar
    if (this.colorbar) {
      out[outI++] = '<div id="' + this._colorbarId + '" onClick="Bs_Objects['+this._id+'].onChangeByClick(event);"';
      if (this.colorbar['cssClass']) {
        out[outI++] = ' class="' + this.colorbar['cssClass'] + '"';
      }
      out[outI++] = ' style="position:absolute; z-index:' + (this.baseZindex +5) + '; width:0;';
      if ('undefined' != typeof(this.colorbar['color'])) {
        out[outI++] = ' background-color:' + this.colorbar['color'] + ';';
      } else if ('undefined' == typeof(this.colorbar['cssClass'])) {
        out[outI++] = ' background-color:orange;';
      }
      if ('undefined' != typeof(this.colorbar['offsetLeft'])) {
        out[outI++] = ' left:' + (localOffset + this.colorbar['offsetLeft']) + ';';
      }
      if ('undefined' != typeof(this.colorbar['offsetTop'])) {
        out[outI++] = ' top:' + this.colorbar['offsetTop'] + ';';
      }
      if ('undefined' != typeof(this.colorbar['height'])) {
        out[outI++] = ' height:' + this.colorbar['height'] + ';';
      }
      out[outI++] = '">';
      out[outI++] = '<img src="/_bsImages/spacer.gif" width="1" height="5"></div>';
    }
		if (this.colorbar2) {
      out[outI++] = '<div id="' + this._colorbarId + '2" onClick="Bs_Objects['+this._id+'].onChangeByClick(event);"';
      if (this.colorbar2['cssClass']) {
        out[outI++] = ' class="' + this.colorbar2['cssClass'] + '"';
      }
      out[outI++] = ' style="position:absolute; z-index:' + (this.baseZindex +5) + '; width:0;';
      if ('undefined' != typeof(this.colorbar2['color'])) {
        out[outI++] = ' background-color:' + this.colorbar2['color'] + ';';
      } else if ('undefined' == typeof(this.colorbar2['cssClass'])) {
        out[outI++] = ' background-color:orange;';
      }
			/*
      if ('undefined' != typeof(this.colorbar2['offsetRight'])) {
        out[outI++] = ' right:' + (localOffset + this.colorbar2['offsetRight']) + ';';
      }
			*/
      if ('undefined' != typeof(this.colorbar2['offsetLeft'])) {
        out[outI++] = ' left:' + (localOffset + this.colorbar2['offsetLeft']) + ';';
      }
      if ('undefined' != typeof(this.colorbar2['offsetTop'])) {
        out[outI++] = ' top:' + this.colorbar2['offsetTop'] + ';';
      }
      if ('undefined' != typeof(this.colorbar2['height'])) {
        out[outI++] = ' height:' + this.colorbar2['height'] + ';';
      }
      out[outI++] = '">';
      out[outI++] = '<img src="/_bsImages/spacer.gif" width="1" height="5"></div>';
		}
    
		
    //main layer
    out[outI++] = '<div id="' + this._slideBarId + '" onClick="Bs_Objects['+this._id+'].onChangeByClick(event);"';
		
		var tmpLeft = (this.direction == 0) ? localOffset : 0;
		var tmpTop  = (this.direction == 0) ? 0           : localOffset;
		out[outI++] = ' style="position:absolute; left:' + tmpLeft + '; top:' + tmpTop + '; width:' + divWidth + '; height: ' + divHeight + '; clip:rect(0 ' + divWidth + '  ' + divHeight + ' 0);';
		
    if (this.bgColor) {
      out[outI++] = 'background-color:' + this.bgColor + '; layer-background-color:' + this.bgColor + ';';
    }
    if (this._bgImgSrc) {
      out[outI++] = ' background-image: url(' + this.imgDir + this._bgImgSrc + '); background-repeat:' + this._bgImgRepeat + ';';
    }
		if (this._bgImgCssStyle) {
	    out[outI++] = this._bgImgCssStyle;
		}
    out[outI++] = '"></div>';
		
    localOffset += (this.direction == 0) ? this.width : this.height;
    
		
		//right background image
		if (typeof(this._bgImgRightSrc) != 'undefined') {
			var tmpLeft = (this.direction == 0) ? localOffset : 0;
			var tmpTop  = (this.direction == 0) ? 0           : localOffset;
			out[outI++] = '<div style="position:absolute; left:' + tmpLeft + '; top:' + tmpTop + ';">';
			out[outI++] = '<img src="' + this.imgDir + this._bgImgRightSrc + '" width="' + this._bgImgRightWidth + '" height="' + this._bgImgRightHeight + '" border="0">';
			out[outI++] = '</div>';
			localOffset += (this.direction == 0) ? this._bgImgRightWidth : this._bgImgRightHeight;
		}
		
    //arrow right
    if ((this.arrowAmount > 0) && this._arrowIconRightSrc) {
			var tmpLeft = (this.direction == 0) ? localOffset : 0;
			var tmpTop  = (this.direction == 0) ? 0           : localOffset;
      out[outI++] = '<div id="' + this._arrowRightContainerId + '" style="position:absolute; left:' + tmpLeft + '; top:' + tmpTop + ';">';
			out[outI++] = '<a href="javascript:void(false);"';
			if (this.arrowMouseOver) {
				out[outI++] = ' onMouseOver="Bs_Objects['+this._id+'].onChangeByArrow(true, true); return false;"';
				out[outI++] = ' onMouseOut="Bs_Objects['+this._id+'].stopFireArrow(); return false;"';
			} else {
				//old:
				//out[outI++] = ' onClick="Bs_Objects['+this._id+'].onChangeByArrow(true); return false;"';
				//new:
				out[outI++] = ' onMouseDown="Bs_Objects['+this._id+'].onChangeByArrow(true, true); return false;"';
				out[outI++] = ' onMouseUp="Bs_Objects['+this._id+'].stopFireArrow(); return false;"';
				out[outI++] = ' onMouseOut="Bs_Objects['+this._id+'].stopFireArrow(); return false;"';
			}
			out[outI++] = '>';
			out[outI++] = '<img id="' + this._arrowRightIconId + '" src="' + this.imgDir + this._arrowIconRightSrc + '" border="0" width="' + this._arrowIconRightWidth + '" height="' + this._arrowIconRightHeight + '"';
			if (typeof(this.arrowIconRightCssStyle) != 'undefined') {
				out[outI++] = ' style="' + this.arrowIconRightCssStyle + '"';
			}
			out[outI++] = '>';
			out[outI++] = '</a></div>';
      localOffset += this._arrowIconRightWidth;
    }
    
    //input field and text
		if (this.useSecondKnob) {
			out[outI++] = this._renderInputFieldAndText(localOffset, 2);
		} else {
			out[outI++] = this._renderInputFieldAndText(localOffset, 1);
		}
		
		out[outI++] = '</div>';
    
    //container end
    out[outI++] = '</div>';
    
    document.getElementById(tagId).innerHTML = out.join('');
		
    this._containerObj           = document.getElementById(this._containerId);
    this._arrowLeftContainerObj  = document.getElementById(this._arrowLeftContainerId);
    this._arrowLeftIconObj       = document.getElementById(this._arrowLeftIconId);
    this._arrowRightContainerObj = document.getElementById(this._arrowRightContainerId);
    this._arrowRightIconObj      = document.getElementById(this._arrowRightIconId);
    this._slideBarObj            = document.getElementById(this._slideBarId);
		
		
		
    this._handleObj              = document.getElementById(this._handleId);
    this._valueContainerObj      = document.getElementById(this._valueContainerId);
    this._valueFieldObj          = document.getElementById(this._valueFieldId);
    this._valueTextObj           = document.getElementById(this._valueTextId);
    this._colorbarObj            = document.getElementById(this._colorbarId);
		
    this._posSlideStart = (this.direction == 0) ? getDivLeft(this._slideBarObj) : getDivTop(this._slideBarObj);
    this._slideWidth    = (this.direction == 0) ? this.width - this._sliderImgWidth : this.height - this._sliderImgHeight;
    this._posSlideEnd   = this._posSlideStart + this._slideWidth;
    
    this._currentRelSliderPosX = this._posSlideStart;
    if (this.valueDefault > this.minVal) {
      //how many percent is valueDefault from maxVal-minVal?
      var hundertPercent = this.maxVal - this.minVal;
      var myPercent      = (this.valueDefault-this.minVal) * 100 / hundertPercent;
      //now how much is that from the given length?
      this._currentRelSliderPosX += (myPercent * this._slideWidth / 100);
    }
		if (this.direction == 0) {
	    this._handleObj.style.left = this._currentRelSliderPosX;
		} else {
	    this._handleObj.style.top  = this._currentRelSliderPosX;
		}
    this._handleObj.style.display = 'block';
    
    //handleObj = handlespan
    temp = ech_attachMouseDrag(this._handleObj,this.slideStart,null,this.slideMove,null,this.slideEnd,null,null,null);
    temp = temp.linkCtrl(getDivImage('', 'poImg' + tagId));
    this.ctrl           = temp;
    this.ctrl.sliderObj = this; //add back reference
		this.ctrl.knobId    = 1;
		
    var x = getDivLeft(this._handleObj);
    var y = getDivTop(this._handleObj);
    y = 0; //z3b
    
    if (this.direction == 0) {   // horizontal
      this.ctrl.minX = this._posSlideStart;
      this.ctrl.maxX = this._posSlideEnd;
      this.ctrl.minY = y;
			this.ctrl.maxY = y;
    } else {      // vertical
      this.ctrl.minX = x;
      this.ctrl.maxX = x;
      this.ctrl.minY = this._posSlideStart;
			this.ctrl.maxY = this._posSlideEnd;
    }
    
		
		
		if (this.useSecondKnob) {
	    this._handleObj2              = document.getElementById(this._handleId + '2');
	    this._valueContainerObj2      = document.getElementById(this._valueContainerId + '2');
	    this._valueFieldObj2          = document.getElementById(this._valueFieldId + '2'); //may fail if only 1 field used.
	    this._valueTextObj2           = document.getElementById(this._valueTextId + '2');
	    this._colorbarObj2            = document.getElementById(this._colorbarId + '2');
			
	    this._slideWidth2    = (this.direction == 0) ? this.width - this._sliderImgWidth2 : this.height - this._sliderImgHeight2;
	    this._posSlideEnd2   = this._posSlideStart + this._slideWidth2;
	    
	    this._currentRelSliderPosX2 = this._posSlideStart;
	    if (this.valueDefault2 > this.minVal2) {
	      //how many percent is valueDefault from maxVal-minVal?
	      var hundertPercent = this.maxVal2 - this.minVal2;
	      var myPercent      = (this.valueDefault2-this.minVal2) * 100 / hundertPercent;
	      //now how much is that from the given length?
	      this._currentRelSliderPosX2 += (myPercent * this._slideWidth2 / 100);
	    }
			if (this.direction == 0) {
		    this._handleObj2.style.left = this._currentRelSliderPosX2;
			} else {
		    this._handleObj2.style.top  = this._currentRelSliderPosX2;
			}
	    this._handleObj2.style.display = 'block';
	    
	    //handleObj = handlespan
	    temp2 = ech_attachMouseDrag(this._handleObj2,this.slideStart,null,this.slideMove,null,this.slideEnd,null,null,null);
	    temp2 = temp2.linkCtrl(getDivImage('', 'poImg' + tagId + '2'));
	    this.ctrl2           = temp2;
	    this.ctrl2.sliderObj = this; //add back reference
			this.ctrl2.knobId    = 2;
			
	    var x = getDivLeft(this._handleObj2);
	    var y = getDivTop(this._handleObj2);
	    y = 0; //z3b
	    
	    if (this.direction == 0) {   // horizontal
	      this.ctrl2.minX = this._posSlideStart;
	      this.ctrl2.maxX = this._posSlideEnd2;
	      this.ctrl2.minY = y;
				this.ctrl2.maxY = y;
	    } else {      // vertical
	      this.ctrl2.minX = x;
	      this.ctrl2.maxX = x;
	      this.ctrl2.minY = this._posSlideStart;
				this.ctrl2.maxY = this._posSlideEnd2;
	    }
			
		}
		
    this._updateColorbar(this._currentRelSliderPosX, 1);
    this._updateColorbar(this._currentRelSliderPosX2, 2);
  }
  
	
	/**
	* @access private
	* @param  ? localOffset
	* @param  int knobId (default is 1 can be 2.)
	* @return string
	*/
	this._renderInputFieldAndText = function(localOffset, knobId) {
		var k = ((typeof(knobId) == 'undefined') || (knobId == 1)) ? '' : '2';
		var out = new Array();
    var styleValueFieldClass = (this['styleValueFieldClass'+k]) ? ' class="' + this['styleValueFieldClass'+k] + '"' : '';
    var styleValueTextClass  = (this['styleValueTextClass'+k])  ? ' class="' + this['styleValueTextClass'+k]  + '"' : '';
		
		
		var cssAlign = (this.useSecondKnob && (knobId == 1)) ? 'align:right;' : '';
		
		//if (this['useInputField'+k] != 0) {
	    out[out.length] = '<div id="' + this._valueContainerId + k + '" style="position:absolute; left:' + localOffset + '; top:0px;">';
		//}
		
    if (this['useInputField'+k] == 1) {
      //view only
      out[out.length] = '<span' + styleValueTextClass + ' id="' + this._valueTextId + k + '">' + this['valueDefault'+k]  + '</span>';
      out[out.length] = '<input type="hidden" name="' + this['fieldName'+k] + '" id="' + this._valueFieldId + k + '" value="' + this['valueDefault'+k] + '">';
    } else if (this['useInputField'+k] == 2) {
      //edit
      out[out.length] = '<input type="text"' + styleValueFieldClass + ' onMouseOver="bsFormFieldSetFocusAndSelect(this, false);" name="' + this['fieldName'+k] + '" id="' + this._valueFieldId + k + '" value="' + this['valueDefault'+k] + '" size="2"';
      if (styleValueFieldClass == '') { //so it does not look *that* bad by default.
        out[out.length] = ' style="vertical-align:text-top; width:30; height:' + this.height + ';"';
      }
      out[out.length] = ' onKeyUp="Bs_Objects['+this._id+'].onChangeByInput(this.value, false, '+knobId+');" onBlur="Bs_Objects['+this._id+'].onChangeByInput(this.value, true, '+knobId+');">';
    } else if (this['useInputField'+k] == 3) {
      //view, start editmode on click
      out[out.length] = '<input type="text"' + styleValueFieldClass + ' onMouseOver="bsFormFieldSetFocusAndSelect(this, false);" name="' + this['fieldName'+k] + '" id="' + this._valueFieldId + k + '" value="' + this['valueDefault'+k] + '" size="2"';
      if (styleValueFieldClass == '') { //so it does not look *that* bad by default.
        out[out.length] = ' style="display:none; vertical-align:text-top; width:30; height:' + this.height + ';"';
      } else {
        out[out.length] = ' style="display:none;"';
      }
      out[out.length] = ' onKeyUp="Bs_Objects['+this._id+'].onChangeByInput(this.value, false, '+knobId+');" onBlur="var _bss = Bs_Objects['+this._id+']; _bss.onChangeByInput(this.value, true, '+knobId+'); _bss.textboxEdit(false, '+knobId+')">';
      out[out.length] = '<span' + styleValueTextClass + ' style="' + cssAlign + '" id="' + this._valueTextId + k + '" ';
      if (this.inputTextFieldEvent == 'click') {
        out[out.length] = 'onClick="Bs_Objects['+this._id+'].textboxEdit(true, '+knobId+');"';
      } else {
        out[out.length] = 'onMouseOver="Bs_Objects['+this._id+'].textboxEdit(true, '+knobId+');"';
      }
      out[out.length] = '>' + this['valueDefault'+k]  + '</span>';
    } else { //0
      out[out.length] = '<input type="hidden" name="' + this['fieldName'+k] + '" id="' + this._valueFieldId + k + '" value="' + this['valueDefault'+k] + '">';
    }
		//if (this['useInputField'+k] != 0) {
	    out[out.length] = '</div>';
		//}
		return out.join('');
	}
  
	
  /**
  * Renders the checkbox component and places it into the page.
	* 
  * @access public
  * @param string tagId Id of the tag. (Use <div> or <span> to hold the ID)
	* @return void
  */
  this.drawInto = function(tagId) {
    this.render(tagId);
		if (this._disabled) this.setDisabled(true);
  }
  
  /**
  * DEPRECATED.
	* Use drawInto()
	* @deprecated use drawInto()
  * @param string tagId (id of the span tag.)
  * @see drawInto()
	* @return void
	*/
  this.draw = function(tagId) {
    this.render(tagId);
		if (this._disabled) this.setDisabled(true);    
  }

  /**
  * Attaches an event like onChange, onMouseOver, onClickCaption ... a.s.o.
  * Supported events are:
  * - 'onChange'
  *
  * @access public
  * @param  string trigger (for example 'onChange')
  * @param  function A globalFunctionName (No string)
  * @return void
  * @see    _attachedEvents
  */
  this.attachEvent = function(trigger, yourEvent) {
    if (typeof(this._attachedEvents) == 'undefined') {
      this._attachedEvents = new Array();
    }
    
    if (typeof(this._attachedEvents[trigger]) == 'undefined') {
      this._attachedEvents[trigger] = new Array(yourEvent);
    } else {
      this._attachedEvents[trigger][this._attachedEvents[trigger].length] = yourEvent;
    }
  }
  
  /**
  * Tells if an event is attached for the trigger specified. 
  * @access public
  * @param  string trigger
  * @return bool
  */
  this.hasEventAttached = function(trigger) {
    return (this._attachedEvents && this._attachedEvents[trigger]);
  }
  
  /**
  * Fires the events for the trigger specified.
  * (used internally, but feel free to trigger events yourself...)
  * @access public
  * @param  string trigger (for example 'onClickCaption')
  * @return void
  */
  this.fireEvent = function(trigger) {
    if (this._attachedEvents && this._attachedEvents[trigger]) {
      var e = this._attachedEvents[trigger];
      if ((typeof(e) == 'string') || (typeof(e) == 'function')) {
        e = new Array(e);
      }
      for (var i=0; i<e.length; i++) {
        if (typeof(e[i]) == 'function') {
          e[i](this);
        } else if (typeof(e[i]) == 'string') {
          eval(e[i]);
        } //else murphy
      }
    }
  }
  
  
  /**#@+
  * Attache a global JS-fuction that will be called.
  * @access public
  * @param  function functionName (not a string!)
  */
  this.attachOnChange = function(functionName) {
    this.eventOnChange = functionName;
  }

  this.attachOnSlideStart = function(functionName) {
    this.slideStartCB = functionName;
  }
  this.attachOnSlideMove = function(functionName) {
    this.slideMoveCB = functionName;
  }
  this.attachOnSlideEnd = function(functionName) {
    this.slideEndCB = functionName;
  }
  /**#@-*/
    
  /**#@+
  * Attache a global JS-fuction that will be called.
  * @access public
  * @param  function func (not a string!)
  */
  this.attachOnArrow = function(functionName) {
    this.eventOnArrow = functionName;
  }
  this.attachOnInputChange = function(functionName) {
    this.eventOnInputChange = functionName;
  }
  this.attachOnInputBlur = function(functionName) {
    this.eventOnInputBlur = functionName;
  }
  /**#@-*/
  
	
  /**
  * Sets the knob icon to be used by the slider.
  * @access public
  * @param  string imgName (on path)
  * @param  int  width if image in pixel
  * @param  int  height if image in pixel
  * @see imgDir
  * @return void
  */
  this.setSliderIcon = function(imgName, width, height) {
    this._sliderImgSrc    = imgName;
    this._sliderImgWidth  = width;
    this._sliderImgHeight = height;
  }
  this.setSliderIcon2 = function(imgName, width, height) {
    this._sliderImgSrc2    = imgName;
    this._sliderImgWidth2  = width;
    this._sliderImgHeight2 = height;
  }
  
	/**
	* sets the arrow icon left/top (depending on direction horizontal/vertical).
	* @access public
	* @param  string imgName
	* @param  int width
	* @param  int height
	* @return void
	*/
  this.setArrowIconLeft = function(imgName, width, height) {
    this._arrowIconLeftSrc    = imgName;
    this._arrowIconLeftWidth  = width;
    this._arrowIconLeftHeight = height;
  }
	
	/**
	* sets the arrow icon right/bottom (depending on direction horizontal/vertical).
	* @access public
	* @param  string imgName
	* @param  int width
	* @param  int height
	* @return void
	*/
  this.setArrowIconRight = function(imgName, width, height) {
    this._arrowIconRightSrc    = imgName;
    this._arrowIconRightWidth  = width;
    this._arrowIconRightHeight = height;
  }
  
  /**
  * Sets a background image.
	* 
	* possible values for the repeat css property: 
	*   repeat    => the background image repeats on both axis
	*   repeat-x  => the bg image repeats on the x-axis only. 
	*   repeat-y  => the bg image repeats on the y-axis only.
	*   no-repeat => the bg image does not repeat; it only shows once.
	* 
  * @access public
  * @param  string src
  * @param  string repeat (read above)
	* @param  string cssStyle (additional css style string, eg "left:4px;" to indent 4px from the left. since bs-4.6)
  * @return void
	* @see    setBackgroundImageLeft(), setBackgroundImageRight()
  */
  this.setBackgroundImage = function(src, repeat, cssStyle) {
    this._bgImgSrc        = src;
    this._bgImgRepeat     = repeat;
		this._bgImgCssStyle   = cssStyle;
  }
	
  /**
  * Sets a background image to use on the left side. see the examples.
  * @access public
	* @param  string imgName
	* @param  int width
	* @param  int height
  * @return void
	* @see    setBackgroundImage(), setBackgroundImageRight()
  */
  this.setBackgroundImageLeft = function(imgName, width, height) {
    this._bgImgLeftSrc    = imgName;
    this._bgImgLeftWidth  = width;
    this._bgImgLeftHeight = height;
  }
	
  /**
  * Sets a background image to use on the right side. see the examples.
  * @access public
	* @param  string imgName
	* @param  int width
	* @param  int height
  * @return void
	* @see    setBackgroundImage(), setBackgroundImageLeft()
  */
  this.setBackgroundImageRight = function(imgName, width, height) {
    this._bgImgRightSrc    = imgName;
    this._bgImgRightWidth  = width;
    this._bgImgRightHeight = height;
  }
	
  
  /**
  * How the slider should be seen in the browser. 
  * <pre>
  *   (rtfm about css)
  *   0 = display:none
  *   1 = visibility:hidden
  *   2 = display:block
  * </pre>
  * 
  * @access public
  * @param  int display
  * @see    _display
  */
  this.setDisplay = function(display) {
    this._display = display;
    if (this._containerObj) {
      switch (display) {
        case 0:
          this._containerObj.style.display = 'none';
          break;
        case 1:
          this._containerObj.style.visibility = 'hidden';
          break;
        case 2:
          //we need to activate both
          this._containerObj.style.visibility = 'visible';
          this._containerObj.style.display = 'block';
          break;
        default: 
          //user set an invalid value.
      }
    }
  }
  /**
	* Disables (or re-enables) the whole slider.
	* 
	* if the param b is not specified, the current disabled mode will be toggled (inverted).
	* 
	* @access public
	* @param  bool b (true=disabled, false=enabled, not set or null = toggle current state.)
	* @return void
	* @since  bs4.4
	*/
	this.setDisabled = function(b) {
		if (typeof(b) == 'undefined') b = !this._disabled;
		
		if (b) {
			//be aware that the filters don't work on all elements, in all cases. there's not much i can do.
			//it once didn't work in a div, but then it worked in a table at the same place.
			//now it does not work on a span. well... not a killer feature.
			var filter = 'progid:DXImageTransform.Microsoft.BasicImage(grayScale=1); progid:DXImageTransform.Microsoft.BasicImage(opacity=.5)';
			var cursor = 'default';
		} else {
			var filter = null;
			var cursor = 'hand'; //moz == pointer
		}
		
		var t = new Array(
			this._containerId, this._arrowLeftContainerId, this._arrowRightContainerId, 
			this._valueFieldId, this._valueTextId, 
			this._slideBarId, this._colorbarId, this._handleId, 
			this._valueFieldId + '2', 
			this._valueTextId + '2', 
			this._colorbarId + '2', 
			this._handleId + '2'
		); //this._valueContainerId, 
		
		for (var i=0; i<t.length; i++) {
			var elm = document.getElementById(t[i]);
			if (elm != null) elm.style.filter = filter;
		}
		var elm = document.getElementById(this._arrowLeftIconId);
		if (elm != null) elm.style.cursor = cursor;
		
		var elm = document.getElementById(this._arrowRightIconId);
		if (elm != null) elm.style.cursor = cursor;
		
		var elm = document.getElementById(this._valueFieldId);
		if (elm != null) elm.disabled = b;
		
		this._disabled = b;
	}
  
  /**
  * Returns the current silder value.
  * @access public
	* @param  int knobId (default is 1 can be 2.)
  * @return double
	* @see    getValueInPercent()
  */
  this.getValue = function(knobId) {
		if ((typeof(knobId) == 'undefined') || (knobId == 1)) {
	    return this._valueInternal;
		} else {
	    return this._valueInternal2;
		}
  }
  
	/**
	* returns the current slider value in percent (compared to min/max value).
	* @access public
	* @param  int knobId (default is 1 can be 2.)
	* @return double (0 - 100)
	* @see    getValue()
	* @since  bs-4.6
	*/
	this.getValueInPercent = function(knobId) {
		//thanks to Carl Meisner <carlmeis@hotmail.com> for a bugfix 2005-06-29 --andrej
		if ((typeof(knobId) == 'undefined') || (knobId == 1)) {
			var range   = Math.abs(this.maxVal - this.minVal);
			var percent = Math.abs(this._valueInternal - this.minVal) / range * 100;
			return percent;
		} else {
			var range   = Math.abs(this.maxVal2 - this.minVal2);
			var percent = Math.abs(this._valueInternal2 - this.minVal2) / range * 100;
			return percent;
		}
	}
	
	
  /**
  * Returns the current slider relative position in pixel.
  * @access public
	* @param  int knobId (default is 1, can be 2)
  * @return int
  */
  this.getSliderPos = function(knobId) {
		if (typeof(knobId) == 'undefined') knobId = 1;
		if (knobId == 1) {
	    var absLeng = (this.direction==0) ? getDivLeft(this.ctrl.div) - this.ctrl.minX : getDivTop(this.ctrl.div) - this.ctrl.minY;
  	  var absRang = this.maxVal - this.minVal;
	    //alert("975: absLeng:" +absLeng+"  absRang:"+absRang+"  _slideWidth:"+this._slideWidth);
  	  return (absLeng * absRang/this._slideWidth) + this.minVal;
		} else {
	    var absLeng = (this.direction==0) ? getDivLeft(this.ctrl2.div) - this.ctrl2.minX : getDivTop(this.ctrl2.div) - this.ctrl2.minY;
  	  var absRang = this.maxVal2 - this.minVal2;
  	  return (absLeng * absRang/this._slideWidth) + this.minVal2;
		}
  }
	
  
  /**
  * Fires when the user slides.
  * @access private
	* @param  ? ctrl
  */
  this.onChangeBySlide = function(ctrl) {
    if (this._disabled) return;
    var newPos   = this._getNewLocationFromCursor(ctrl);
    var valByPos = this._getValueByPosition(newPos);
    var val      = this._roundToGrid(valByPos, ctrl.knobId);
		var valInternal = (ctrl.knobId == 1) ? this._valueInternal : this._valueInternal2;
    if (val != valInternal) {
			newPos = this._getPositionByValue(val, ctrl.knobId); //fix it so it is nicely rounded and not over the edges (needed). 2006-07-24 --andrej
      if (ctrl.knobId == 1) {
				this._valueInternal = val;
			} else {
				this._valueInternal2 = val;
			}
      this.updateHandle(newPos, ctrl.knobId);
      this.updateValueField(val, ctrl.knobId);
      this.updateValueText(val, ctrl.knobId);
      this._updateColorbar(newPos, ctrl.knobId);
      if ('undefined' != typeof(this.eventOnChange)) {
				if (this.useSecondKnob) {
					this.eventOnChange(this, val, newPos, ctrl.knobId);
				} else {
					this.eventOnChange(this, val, newPos);
				}
			}
      this.fireEvent('onChange');
    }
  }
  
  /**
  * If a browser does not support that way of changing the slider value, 
  * nothing gets done.
  * @access public
  * @param  object event (the event object)
  * @return void
  */
  this.onChangeByClick = function(event) {
    if (this._disabled) return;
    var newPos = 0;
    if ('undefined' != typeof(event.offsetX)) {
      newPos = (this.direction == 0) ? event.offsetX + this._posSlideStart : event.offsetY + this._posSlideStart;
    } else if ('undefined' != typeof(event.layerX)) {
      newPos = (this.direction == 0) ? event.layerX + this._posSlideStart  : event.layerY  + this._posSlideStart;
    } else {
      return; //not supported.
    }
    
    var val = this._getValueByPosition(newPos);
		
		if (this.useSecondKnob) {
			// this.preventValueCrossing
			if (val > this._valueInternal2) {
				var knobId = 2;
			} else if (val < this._valueInternal) {
				var knobId = 1;
			} else {
				//clicked somewhere in between.
				//cancel it for now.
				//we could see which is closer, but i doubt it would be more user-friendly.
				return;
			}
		} else {
			var knobId = 1;
		}
		
    val = this._roundToGrid(val, knobId);
		
    if (val != this._valueInternal) {
			newPos = this._getPositionByValue(val, knobId); //fix it so it is nicely rounded and not over the edges (needed). 2006-07-24 --andrej
      if (knobId == 1) {
				this._valueInternal = val;
			} else {
				this._valueInternal2 = val;
			}
      this.updateHandle(newPos, knobId);
      this.updateValueField(val, knobId);
      this.updateValueText(val, knobId);
      this._updateColorbar(newPos, knobId);
      if ('undefined' != typeof(this.eventOnChange)) {
				if (this.useSecondKnob) {
					this.eventOnChange(this, val, newPos, knobId);
				} else {
					this.eventOnChange(this, val, newPos);
				}
			}
      this.fireEvent('onChange');
    }
  }
  
  /**
  * Fires when the user inputs a new value into the input field.
  * @access public
  * @param  string val (new value)
  * @param  bool isBlur (if it's a onChange event set to false, on an onBlur event set to true.)
	* @param  int knobId (the default is 1 can also be 2.)
  * @return void
  */
  this.onChangeByInput = function(val, isBlur, knobId) {
		var k = ((typeof(knobId) == 'undefined') || (knobId == 1)) ? '' : '2';
    if (this._disabled) return;
    if (val == '') {
      val = this['minVal'+k];
    }
    val = this._roundToGrid(val, knobId);
    var newPos = this._getPositionByValue(val, knobId);
    if (val != this['_valueInternal'+k]) {
      this['_valueInternal'+k] = val;
      this.updateHandle(newPos, knobId);
      this._updateColorbar(newPos, knobId);
      if ('undefined' != typeof(this.eventOnChange)) {
				if (this.useSecondKnob) {
					this.eventOnChange(this, val, newPos, knobId);
				} else {
					this.eventOnChange(this, val, newPos);
				}
			}
      this.fireEvent('onChange');
      if (isBlur) { //the user may still be typing. don't fuck his typing until he left the field.
        this.updateValueField(val, knobId);
        this.updateValueText(val, knobId);
      }
    } else if (isBlur) {
      //it's possible that the field val is "" (empty) and now the user left that field.
      //we it is still empty, we got the blur event, and need to update the field/text values:
      this.updateValueField(val, knobId);
      this.updateValueText(val, knobId);
    }
  }
  
  /**
  * @access public
  * @param  bool leftOrRight (false=left, true=right. as with politics. :)
	* @param  bool keepFiring  (if true then it sets a timeout to fire again, until this cycle is exited using stopFireArrow().)
	* @param  bool loopCall    (used internally only on calls from setTimeout().)
  */
  this.onChangeByArrow = function(leftOrRight, keepFiring, loopCall) {
		if (!loopCall) this._stopFireArrowFlag = false;
		
		if (this._stopFireArrowFlag) return;
    if (this._disabled) return;
		
    var val = parseFloat(this._valueInternal);
    if (leftOrRight) {
      val += this.arrowAmount; //right arrow
    } else {
      val -= this.arrowAmount; //left arrow
    }
    val = this._roundToGrid(val);
    if (val != this._valueInternal) {
      this._valueInternal = val;
      var newPos = this._getPositionByValue(val);
      this.updateHandle(newPos);
      this.updateValueField(val);
      this.updateValueText(val);
      this._updateColorbar(newPos);
      if ('undefined' != typeof(this.eventOnChange)) {
				if (this.useSecondKnob) {
					this.eventOnChange(this, val, newPos, 1);
				} else {
					this.eventOnChange(this, val, newPos);
				}
			}
      this.fireEvent('onChange');
    }
		//document.getElementById('debug').innerHTML = val + '<br>' + document.getElementById('debug').innerHTML;
		
		if (keepFiring) {
			if (!this._stopFireArrowFlag && (this.arrowKeepFiringTimeout > 0)) {
				setTimeout('Bs_Objects[' + this._id + '].onChangeByArrow(' + leftOrRight + ', ' + keepFiring + ', true);', this.arrowKeepFiringTimeout);
			}
		}
  }
  
	
	/**
	* is called when the mouse wheel is used over the slider.
	* @access public (used internally, you don't need that)
	* @return void
	*/
	this.onMouseWheel = function() {
    if (this._disabled) return;
		
    var val = parseFloat(this._valueInternal);
    if (event.wheelDelta > 0) {
      val -= this.wheelAmount;
    } else {
      val += this.wheelAmount;
    }
    val = this._roundToGrid(val);
    if (val != this._valueInternal) {
      this._valueInternal = val;
      var newPos = this._getPositionByValue(val);
      this.updateHandle(newPos);
      this.updateValueField(val);
      this.updateValueText(val);
      this._updateColorbar(newPos);
      if ('undefined' != typeof(this.eventOnChange)) {
				if (this.useSecondKnob) {
					this.eventOnChange(this, val, newPos, 1);
				} else {
					this.eventOnChange(this, val, newPos);
				}
			}
      this.fireEvent('onChange');
    }
	}
	
	
	/**
	* stops a loop of firing onChangeByArrow().
	* @access public
	* @return void
	* @since  bs-4.6
	*/
	this.stopFireArrow = function() {
		this._stopFireArrowFlag = true;
	}
	
  /**  
  * Sets a new value. even if the slider is disabled. this is allowed since it's an api method.
  * @access public
  * @param  string val (new value)
	* @param  int knobId (default is 1 can be 2.)
  * @return void
  */
  this.setValue = function(val, knobId) {
		if (typeof(knobId) == 'undefined') knobId = 1;
    val = this._roundToGrid(val, knobId);
    var newPos = this._getPositionByValue(val, knobId);
		var valInternal = (knobId == 1) ? this._valueInternal : this._valueInternal2;
    if (val != valInternal) {
      if (knobId == 1) {
				this._valueInternal = val;
			} else {
				this._valueInternal2 = val;
			}
      this.updateHandle(newPos, knobId);
      this._updateColorbar(newPos, knobId);
      if ('undefined' != typeof(this.eventOnChange)) {
				if (this.useSecondKnob) {
					this.eventOnChange(this, val, newPos, knobId);
				} else {
					this.eventOnChange(this, val, newPos);
				}
			}
      this.fireEvent('onChange');
      this.updateValueField(val, knobId);
      this.updateValueText(val, knobId);
    }
  }
	
  /**
	* DEPRECATED use setValue(), this method name was confusing.
	* 
  * Use this to set a new value.
	* 
  * --sam the name is confusing, it's a set-function
	* --andrej: yes, true. I have added setValue().
	* 
  * Note: The value you set is left "as is", thus it is *not* rounded to the next grid.
  *       "Grid rounding" will occur on change (see onChangeByArrow, onChangeByInput, ...). 
  * @access public
  * @param  string val (new value)
	* @param  int knobId (default is 1 can be 2)
  * @return void
	* @depreacted use setValue()
  */
  this.onChangeByApi = function(val, knobId) {
		this.setValue(val, knobId);
  }
	
  
  /**
  * Updates the colorbar visually.
  * @access private
  * @param  int newPos (at least i think it's an int.)
	* @param  int knobId (default is 1 can be 2.)
  * @return void
  */
  this._updateColorbar = function(newPos, knobId) {
		var k = ((typeof(knobId) == 'undefined') || (knobId == 1) || ((typeof(this.colorbar) != 'undefined') && ((typeof(this.colorbar.type) != 'undefined') || (this.colorbar.type == 'between')))) ? '' : '2';
    if (this['_colorbarObj'+k]) {
			if ((typeof(this.colorbar.type) != 'undefined') && (this.colorbar.type == 'between')) {
				var left  = this._getPositionByValue(this._valueInternal,  1);
				var right = this._getPositionByValue(this._valueInternal2, 2);
	      this['_colorbarObj'+k].style.left  = left + this.colorbar.offsetLeft;
	      this['_colorbarObj'+k].style.width = right - left;
			} else {
	      var newWidth = newPos + this['colorbar'+k]['widthDifference'];
	      if (newWidth < 0) newWidth = 0;
				if (k == '2') {
					var invertedWidth = this.width - newWidth;
					if (invertedWidth < 0) invertedWidth = 0;
		      this['_colorbarObj'+k].style.width = invertedWidth;
					if (typeof(this.colorbar2['offsetLeft']) != 'undefined') newWidth += this.colorbar2['offsetLeft'];
		      this['_colorbarObj'+k].style.left  = newWidth;
		      //this['_colorbarObj'+k].style.right = 0;
				} else {
		      this['_colorbarObj'+k].style.width = newWidth;
				}
			}
			
			if (typeof(this['colorbar'+k]['color2']) != 'undefined') {
				//fading feature used.
				var percent  = this.getValueInPercent(knobId);
				var newColor = mixColor(this['colorbar'+k]['color'], this['colorbar'+k]['color2'], percent);
				document.getElementById(this._colorbarId+k).style.backgroundColor = newColor;
			}
    }
  }
  
  /**
  * Calculates the value based on the given position.
  * @access private
  * @param  int pos
  * @return double
  */
  this._getValueByPosition = function(pos) {
		if (this.direction == 0) {
	    pos -= this.ctrl.minX;
  	  var hundertPercent = this.ctrl.maxX - this.ctrl.minX;
		} else {
	    pos -= this.ctrl.minY;
  	  var hundertPercent = this.ctrl.maxY - this.ctrl.minY;
		}
    var myPercent      = pos / hundertPercent;
    var val            = this.minVal + ((this.maxVal - this.minVal) * myPercent);
    return val;
  }
  
  /**
  * Calculates the position based on the given value.
  * @access private
  * @param  double val
	* @param  int knobId (default is 1 can be 2.)
  * @return int
  */
  this._getPositionByValue = function(val, knobId) {
		var k = ((typeof(knobId) == 'undefined') || (knobId == 1)) ? '' : '2';
		
    val = val - this['minVal'+k]; //since 4.3, needed. was buggy before if minVal was not 0.
    var hundertPercent = this['maxVal'+k] - this['minVal'+k];
    var myPercent      = val / hundertPercent;
		if (this.direction == 0) {
	    var pos = this['ctrl'+k].minX + ((this['ctrl'+k].maxX - this['ctrl'+k].minX) * myPercent);
			if (pos < this['ctrl'+k].minX) {
				pos = this['ctrl'+k].minX;
			} else if (pos > this['ctrl'+k].maxX) {
				pos = this['ctrl'+k].maxX;
			}
		} else {
	    var pos = this['ctrl'+k].minY + ((this['ctrl'+k].maxY - this['ctrl'+k].minY) * myPercent);
			if (pos < this['ctrl'+k].minY) {
				pos = this['ctrl'+k].minY;
			} else if (pos > this['ctrl'+k].maxY) {
				pos = this['ctrl'+k].maxY;
			}
		}
		
    return pos;
  }
  
  /**
  * Parse and round value to next grid defined by this.valueInterval, 
	* and check lower/upper bounds.
  * @access private
  * @param  string val
	* @param  int knobId (default is 1 can be 2.)
  * @return float
  */
  this._roundToGrid = function(val, knobId) {
    val = parseFloat(val);
    if (isNaN(val)) return this.minVal;
    
    val = Math.round(val / this.valueInterval) * this.valueInterval;
    // Js has some odd rounding problems somewhere at 10^-8. To get rid of it we do: 
    val = Math.round(val*10000)/10000;
    
    //check upper/lower bounds
    if (val < this.minVal) val = this.minVal;
    if (val > this.maxVal) val = this.maxVal;
		
		if (this.useSecondKnob && this.preventValueCrossing) {
			if ((typeof(knobId) == 'undefined') || (knobId == 1)) {
				if (val >= this._valueInternal2) {
					val = this._valueInternal2 - this.valueInterval;
			    if (val < this.minVal) val = this.minVal;
				}
			} else {
				if (val <= this._valueInternal) {
					val = this._valueInternal + this.valueInterval2;
			    if (val > this.maxVal2) val = this.maxVal2;
				}
			}
		}
		
    return val;
  }
  
  /**
  * Returns the new handle pos.
  * @access private
	* @param  ? ctrl
  * @return int
  */
  this._getNewLocationFromCursor = function(ctrl) {
		/*
    var ox = this._posEventSlideStartX;
    var oy = this._posEventSlideStartY;
    switch (this.direction) {
      case 0: // horizontal
        var t = this.ctrl.pageX - ox;
        var x = parseInt(this._posObjSlideStartX) + t;
        if (x > this.ctrl.maxX) x = this.ctrl.maxX;
        if (x < this.ctrl.minX) x = this.ctrl.minX;
        return x;
      case 1: // vertical
        var t = this.ctrl.pageY - oy;
        var y = parseInt(this._posObjSlideStartY) + t;
        if (y > this.ctrl.maxY) y = this.ctrl.maxY;
        if (y < this.ctrl.minY) y = this.ctrl.minY;
        return y;
    }
		*/
		if (ctrl.knobId == 1) {
  	  var ox = this._posEventSlideStartX;
	    var oy = this._posEventSlideStartY;
			var posObjSlideStartX = this._posObjSlideStartX;
			var posObjSlideStartY = this._posObjSlideStartY;
		} else {
  	  var ox = this._posEventSlideStartX2;
	    var oy = this._posEventSlideStartY2;
			var posObjSlideStartX = this._posObjSlideStartX2;
			var posObjSlideStartY = this._posObjSlideStartY2;
		}
    switch (this.direction) {
      case 0: // horizontal
        var t = ctrl.pageX - ox;
        var x = parseInt(posObjSlideStartX) + t;
        if (x > ctrl.maxX) x = ctrl.maxX;
        if (x < ctrl.minX) x = ctrl.minX;
        return x;
      case 1: // vertical
        var t = ctrl.pageY - oy;
        var y = parseInt(posObjSlideStartY) + t;
        if (y > ctrl.maxY) y = ctrl.maxY;
        if (y < ctrl.minY) y = ctrl.minY;
        return y;
    }
  }
  
  /**
  * Slides, in other words "updates the handle/knob".
	* doesn't seem to be used. not used internally and is set to private.
  * @access private
  * @deprecated use updateHandle()
  * @param  int newPos
  * @return void
  */
  this.updatePointer = function(newPos) {
    this.updateHandle(newPos);
  }
  
  /**
  * Slides to new relative position, in other words "moves the handle/knob".
  * @access public
  * @param  int newPos in pixel
	* @param  int knobId (default is 1 can be 2.)
  * @return void
  */
  this.updateHandle = function(newPos, knobId) {
		if ((typeof(knobId) == 'undefined') || (knobId == 1)) {
			if (this.direction == 0) {
		    this._currentRelSliderPosX = newPos;
	  	  this.ctrl.div.style.left   = newPos;
			} else {
		    this._currentRelSliderPosX = newPos;
	  	  this.ctrl.div.style.top    = newPos;
			}
		} else { //2
			if (this.direction == 0) {
		    this._currentRelSliderPosX2 = newPos;

	  	  this.ctrl2.div.style.left   = newPos;


			} else {
		    this._currentRelSliderPosX2 = newPos;
	  	  this.ctrl2.div.style.top    = newPos;
			}
		}
    return;
  }
  
  /**
  * Updates the value of the input field.
  * @access public
  * @param  mixed val (string or number)
	* @param  int knobId (default is 1 can be 2.)
  * @return void
  * @see    updateValueText()
  */
  this.updateValueField = function(val, knobId) {
		var k = ((typeof(knobId) == 'undefined') || (knobId == 1)) ? '' : '2';
    if (this['_valueFieldObj'+k]) {
      this['_valueFieldObj'+k].value = val;
    }
  }
  
  /**
  * Updates the value of the text box.
  * @access public
  * @param  mixed val (string or number)
	* @param  int knobId (default is 1 can be 2.)
  * @return void
  * @see    updateValueField()
  */
  this.updateValueText = function(val, knobId) {
		var k = ((typeof(knobId) == 'undefined') || (knobId == 1)) ? '' : '2';
    if (this['_valueTextObj'+k]) {
      this['_valueTextObj'+k].innerHTML = val;
    }
  }
  
  /**
  * @access private
  */
  this.arrowOnClick = function() {
  }
  
  /**
  * fires after the value has changed. fires a lot when sliding, also 
  * fires after an arrow click or input change.
  * @access private
  * @param int val (new value)
  */
  this.onChange = function(val) {
		if (this._disabled) return;
		this.setValue(val);
  }
  
  
  /**
  * DEPRECATED
  * updates the input field box and/or the text with the value.
  * @param  string val (number)
  * @access private
  * @return void
  * @deprecated
  */
  this.updateInputBox = function(val) {
		if (this._disabled) return;
    this.setValue(val);
  }
  
  
  /**
  * @access private
  * @param bool editMode
  */
  this.textboxEdit = function(editMode, knobId) {
		var k = ((typeof(knobId) == 'undefined') || (knobId == 1)) ? '' : '2';
    if (this._disabled) return;
    if (editMode) {
      if ('undefined' != typeof(this['_valueFieldObj'+k])) {
        this['_valueTextObj'+k].style.display = 'none';
        this['_valueFieldObj'+k].style.display = 'block';
        bsFormFieldSetFocusAndSelect(this['_valueFieldObj'+k], false);
      }
    } else {
      if ('undefined' != typeof(this['_valueTextObj'+k])) {
        this['_valueFieldObj'+k].style.display = 'none';
        this['_valueTextObj'+k].style.display  = 'block';
      }
    }
  }
  
  /**
  * Fires during the mouse move of the slider-handle (as long as the mouse button is hold)
  * @access private
  * @param  object ctrl The slider handle object
  * @param  object client
  */
  this.slideMove = function(ctrl, client) {
    ctrl.sliderObj.onChangeBySlide(ctrl);
  }
	
	
  /**
  * Fires on first click off the slider-handle
  * @access private
  * @param  object ctrl The slider handle object
  * @param  ? client
  */
  this.slideStart = function(ctrl, client) {
		//for some reason it happens that 'this' is not what it's supposed to be. 
		//we're not were we should. and the slider is disabled. in this case we 
		//ignore this call.
		//undone this, it renders all sliding useless. --andrej
		//if (this._disabled) return;
		//if (typeof(this._disabled) == 'undefined') return;
		
		if (ctrl.knobId == 1) {
			ctrl.sliderObj._handleObj.style.zIndex += 2;
	    ctrl.sliderObj._posEventSlideStartX = ctrl.startX;
	    ctrl.sliderObj._posEventSlideStartY = ctrl.startY;
	    ctrl.sliderObj._posObjSlideStartX   = ctrl.sliderObj._handleObj.style.left;
	    ctrl.sliderObj._posObjSlideStartY   = ctrl.sliderObj._handleObj.style.top;
    } else { //2
			ctrl.sliderObj._handleObj2.style.zIndex += 2;
	    ctrl.sliderObj._posEventSlideStartX2 = ctrl.startX;
	    ctrl.sliderObj._posEventSlideStartY2 = ctrl.startY;
	    ctrl.sliderObj._posObjSlideStartX2   = ctrl.sliderObj._handleObj2.style.left;
	    ctrl.sliderObj._posObjSlideStartY2   = ctrl.sliderObj._handleObj2.style.top;
		}
		
    var pos = ctrl.sliderObj.getSliderPos(ctrl.knobId);
    ctrl.sliderObj.setValue(pos, ctrl.knobId);
    
    if ('undefined' != typeof(ctrl.sliderObj.slideStartCB)) {
      ctrl.sliderObj.slideStartCB(ctrl.sliderObj, ctrl.sliderObj.getValue(), pos);
    }
  }
  
  
  /**
  * Fires on first release of the slider-handle.
  * @access private
  * @param  object ctrl The slider handle object
  * @param  ? client
  */
  this.slideEnd = function(ctrl, client){
		if (this._disabled) return;
		if (ctrl.knobId == 1) {
			ctrl.sliderObj._handleObj.style.zIndex -= 2;
		} else {
			ctrl.sliderObj._handleObj2.style.zIndex -= 2;
		}
    var pos = ctrl.sliderObj.getSliderPos();
    if ('undefined' != typeof(ctrl.sliderObj.slideEndCB)) {
      ctrl.sliderObj.slideEndCB(ctrl.sliderObj, ctrl.sliderObj.getValue(), pos);
    }
    return;
  }
  
  ///////////////////////////////////////////
  // constructor code
  ///////////////////////////////////////////
	this._constructor(theFieldnamePrefix); //call the constructor. needs to be at the end.
 
}

