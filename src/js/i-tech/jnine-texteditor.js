//short documentation
function _(id) {
	// body...
	return document.getElementById(id);
}
function $_(query) {
	// body...
	return document.querySelector(query);
}
function $_create(element) {
	// body...
	return document.createElement(element);
}
function $_classes(name) {
	// body...
	return document.getElementsByClassName(name);
}
//boolean popup
var serialID=0;
//sources
var toolsbgSource = ["/JNine-itech/cms-web-design-texteditor/Img/tool1.png",
				"/JNine-itech/cms-web-design-texteditor/Img/tool2.png",
				"/JNine-itech/cms-web-design-texteditor/Img/tool3.png",
				"/JNine-itech/cms-web-design-texteditor/Img/font.png",
				"/JNine-itech/cms-web-design-texteditor/Img/tool6.png",
				"/JNine-itech/cms-web-design-texteditor/Img/list1.png",
				"/JNine-itech/cms-web-design-texteditor/Img/color.png",
				"/JNine-itech/cms-web-design-texteditor/Img/tool11.png",
				"/JNine-itech/cms-web-design-texteditor/Img/undo.png",
				"/JNine-itech/cms-web-design-texteditor/Img/redo.png",				
				"/JNine-itech/cms-web-design-texteditor/Img/close-icon.png",
				];
var othercolor="/JNine-itech/cms-web-design-texteditor/Img/color.png";
var fontbgSource=[
					"/JNine-itech/cms-web-design-texteditor/Img/font-family.png",
					"/JNine-itech/cms-web-design-texteditor/Img/fontsize.png",
					"/JNine-itech/cms-web-design-texteditor/Img/strike.png",
					"/JNine-itech/cms-web-design-texteditor/Img/super.png",
					"/JNine-itech/cms-web-design-texteditor/Img/spacing.png",
					"/JNine-itech/cms-web-design-texteditor/Img/text-shadow.png",
				];
var alignbgSource=[
					"/JNine-itech/cms-web-design-texteditor/Img/tool6.png",
					"/JNine-itech/cms-web-design-texteditor/Img/tool7.png",
					"/JNine-itech/cms-web-design-texteditor/Img/tool8.png",
					"/JNine-itech/cms-web-design-texteditor/Img/tool9.png",
				];
var listbgSource=[
					"/JNine-itech/cms-web-design-texteditor/Img/list1.png",
					"/JNine-itech/cms-web-design-texteditor/Img/list2.png",
					"/JNine-itech/cms-web-design-texteditor/Img/list3.png",
					"/JNine-itech/cms-web-design-texteditor/Img/upper-alpha.png",
					"/JNine-itech/cms-web-design-texteditor/Img/a-z.png",
					"/JNine-itech/cms-web-design-texteditor/Img/cI-ii.png",
					"/JNine-itech/cms-web-design-texteditor/Img/I-II.png",
					"/JNine-itech/cms-web-design-texteditor/Img/more-icon.png",
				];
var colorbgSource=[
					"/JNine-itech/cms-web-design-texteditor/Img/fontcolor.png",
					"/JNine-itech/cms-web-design-texteditor/Img/highlight.png",
					"/JNine-itech/cms-web-design-texteditor/Img/backgroundfill.png",
				];
var colorSource=[
					"white","whitesmoke","silver","darkgray","gray","black",
					"#00bcd4","#03a9f4","#2196f3","#3f51b5","#673ab7","#9c27b0",
					"#ffeb3b","#ffc107","#ff9800","#ff5722","#f44336","white"
				];
var commands = [
	"underline","bold","italic","","","","","createLink","undo","redo","close"
];
var title = [
	"Underline","Bold","Italic","Choose Font","Text Align","List","Color","Hyper link","Undo","Redo","close"
];

//custom floating box
class Box{
	constructor(){
		this.mainBox;
		this.parentBox=[];
		this.child=[];
		this.recordCMDClass;
		this.box_event=false;
	}

	create(row, col, width,height){

		var box = $_create("div");
		box.style.overflow="hidden";
		box.style.backgroundColor="rgba(255, 255, 255, 0.9)";
		box.style.width=width+"px";
		box.style.height=height+"px";
		box.style.display="flex";
		box.style.flexDirection="column";
		for(var i = 0 ; i < row ; i++){
			var rower = $_create("nav");
			rower.style.width=width;
			rower.style.height=(height/row)+"px";

			rower.style.display="flex";
			rower.style.flexDirection="row";
			for (var j = 0; j < col; j++) {
				var column = $_create("button");
				column.style.border="0";
				column.style.outline="0";
				column.style.width=(width/col)+"px";
				column.style.cursor="pointer";
				
				this.child.push(column);
				rower.appendChild(column);
			}
			box.appendChild(rower);
		}
		this.mainBox=box;
		this.parentBox.push(box);
		return box;
	}
	//short push background
	pushBoxBackground(size,position,url){
		for(var i = 0 ; i < url.length ; i++){
			var c = this.child[i];
			c.style.background="url("+url[i]+") no-repeat";
			c.style.backgroundSize=size;
			c.style.backgroundPosition=position;
		}
	}
	//color
	pushBoxColor(colors){
		for (var i = 0; i < this.child.length; i++) {
			var c = this.child[i];
			c.style.backgroundColor=colors[i];
		}
	}
	//mark each box name
	pushBoxName(name){
		for(var i = 0 ; i < name.length ; i++ ){
			let c = this.child[i];
			c.setAttribute("title",name[i]);
		}
	}
	//mark data class
	dataCMD(name,data){
		for (var i = 0; i < data.length; i++) {
			var c = this.child[i];
			c.classList.add(name);
			this.recordCMDClass=name;
			c.setAttribute("data-command",data[i]);
		}
	}
	
	get getBox(){
		return this.mainBox;
	}
	get parentBoxes(){
		return this.parentBox;
	}
	getParentBox(index){
		return this.parentBox[index];
	}
	getChildBox(index){
		return this.child[index];
	}
	get allChild(){
		return this.child;
	}
}
//main editor
class TextEditor{
	constructor(element){
		this.element = element;
		this.parent = this.element.parentElement;
		this.headerE;
		this.AdditionalTools=[];
		this.recordColorBox=[];
		this.allTools=[];
		this.listB = false;

		this.pop = false;
		this.ffe=[0,1,2,3];
		this.more = false;
		this.rec_m_locX=0;
		this.rec_m_locY=0;
		this.colorPop=false;
		this.ffb =[false,false,false,false];
		this.recordC="";
		this.reversalDisplay=false;
		this.versionID=serialID;
		serialID++;

	}

	//get current element
	logCurrentElement(){
		console.log(this.element);
	}
	createEditor(){
		this.generateTools();
		this.generateEditor();
	}
	//tools
	generateTools(){
		var header = $_create("div");
		header.style.width = "auto";
		header.style.height = "auto";
		header.style.display = "flex";
		header.style.flexDirection = "column";
		header.style.position = "absolute";
		header.style.borderRadius = "2px";
		//header.style.overflow = "hidden";
		header.style.transition = "height 1s";
		

		var vtool = $_create("div");
		vtool.style.display="flex";
		vtool.style.width="auto";
		vtool.style.height="30px";
		vtool.style.backgroundColor="rgb(255 255 255)";
		vtool.style.boxShadow="rgb(0 0 0 / 69%) 2px 4px 3px 0px";
		vtool.style.borderRadius="5px";
		vtool.style.border="1px solid silver";

		var countF=0;

		for(var i = 0 ; i < 11 ; i++ ){
			var tool1 = $_create("button");

			tool1.setAttribute("title",title[i]);
			tool1.style.border="0";
			tool1.style.outline="0";
			tool1.style.cursor = "pointer";

			tool1.style.background="url("+toolsbgSource[i]+") no-repeat";
			
			tool1.style.backgroundPosition = "center";
			if (i >= 3 && i < 7) {
				tool1.style.backgroundSize="70% 70%";
				var ff = this.downField(tool1,40,30);
				ff.classList.add("tool-btns"+this.versionID);
				ff.setAttribute("data-command",this.ffe[countF]);
				countF++;
				vtool.appendChild(ff);
			}else{
				if (i < 6) {
					tool1.style.backgroundSize = "55% 55%";
				}else{
					tool1.style.backgroundSize = "65% 65%";
					if (i == 10) {
						tool1.style.backgroundSize="40% 40%";
					}
				}
				tool1.classList.add('tool-btns'+this.versionID);
				tool1.style.width="30px";
				tool1.style.height="30px";
				tool1.setAttribute("data-command",commands[i]);
				vtool.appendChild(tool1);
			}
			

		}

		var additionalTool = $_create("div");
		additionalTool.style.width="auto";
		additionalTool.style.height="auto";
	//	additionalTool.style.display="flex";

		
		var box1 = new Box();
		var fonttool = box1.create(2,3,90,50);
		fonttool.style.margin="1px 0px 0px 70px";
		fonttool.style.float="left";
		box1.pushBoxBackground("60%","center",fontbgSource);
		var box1Names=["Font-family","Font-size","Strike Through","Super Script","Spacing","Shadow"];
		box1.pushBoxName(box1Names);
		var box1cmd = ["fontName","fontSize","strikeThrough","superscript","Spacing","Shadow"];
		box1.dataCMD("tool-btns"+this.versionID,box1cmd);
		box1.getChildBox(5).style.backgroundSize="95%";
		fonttool.style.width="0";
		fonttool.style.height="0px";
		fonttool.style.transition="height .3s";
		this.AdditionalTools.push(fonttool);
		additionalTool.appendChild(fonttool);

		var box2 = new Box();
		var aligntool = box2.create(2,2,60,50);
		aligntool.style.margin="1px 0px 0px 50px";
		aligntool.style.float="left";
		box2.pushBoxBackground("60%","center",alignbgSource);
		var box2Names=["Left","Right","Justify All","Center"];
		box2.pushBoxName(box2Names);
		var box2cmd = ["justifyLeft","justifyRight","justifyFill","justifyCenter"];
		box2.dataCMD("tool-btns"+this.versionID,box2cmd);
		aligntool.style.width="0";
		aligntool.style.height="0px";
		aligntool.style.transition="height .3s";
		this.AdditionalTools.push(aligntool);
		additionalTool.appendChild(aligntool);

		var box3 = new Box();
		var listtool = box3.create(2,4,120,50);
		listtool.style.float="left";
		listtool.style.margin="1px 0px 0px 20px";
		listtool.style.width="0";
		listtool.style.height="0px";
		listtool.style.transition="height .3s";
		var box3Names=["Square","Circle","Numerical","Upper Alpha","Lower Alpha","Upper Roman","Lower Roman","Other"];
		box3.pushBoxName(box3Names);
		box3.pushBoxBackground("60%","center",listbgSource);
		var box3cmd = ["Square","Circle","Numerical","UA","LA","UR","LR","Other"];
		box3.dataCMD("tool-btns"+this.versionID,box3cmd);
		box3.getChildBox(4).style.backgroundSize="95%";
		box3.getChildBox(5).style.backgroundSize="95%";
		box3.getChildBox(6).style.backgroundSize="95%";
		this.AdditionalTools.push(listtool);
		additionalTool.appendChild(listtool);

		var colorField = $_create("button");
		colorField.style.outline="0";
		colorField.style.float="left";
		colorField.style.border="0";
		colorField.style.width="0px";
		colorField.style.height="0px";
		colorField.style.backgroundColor="transparent";
		colorField.style.transition="height .3s";
		colorField.style.overflow="hidden";
		colorField.style.margin="1px 0px 0px 35px";

		var box4 = new Box();
		var colortool = box4.create(1,3,90,30);
		colortool.style.margin="1px 0px 0px 10px";
		colortool.style.border="1px solid silver";
		colortool.style.borderBottom="1px solid black";
		colortool.style.transition="height .3s";
		var box4Names=["Font Color","Highlight Color","Background Fill"];
		box4.pushBoxName(box4Names);
		var box4cmd = ["fontColor","highlight","background"];
		this.recordColorBox=box4.allChild;
		var cx1 = box4.allChild;
		for(var bx1 of cx1){
			bx1.classList.add("down");
		}
		box4.dataCMD("tool-btns"+this.versionID,box4cmd);
		box4.pushBoxBackground("60%","center",colorbgSource);

		
		var colorBox = new Box();
		var colors = colorBox.create(3,6,180,90);
		colors.style.border="1px solid silver";
		colors.style.margin="0px 0px 0px 10px";
		var boxCcmd = [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
		var cx = colorBox.allChild;
		for(var bx of cx){
			bx.classList.add("down");
		}
		colorBox.dataCMD("tool-btns"+this.versionID,boxCcmd);
		colorBox.pushBoxColor(colorSource);
		colorBox.getChildBox(17).setAttribute("title","Customize Color");

		var cc = $_create("input");
		cc.type="color";
		cc.style.width="0px";
		cc.style.height="0px";
		cc.style.float="right";
		cc.setAttribute("id","cc");
		colorBox.getChildBox(17).appendChild(cc);
		

		colorBox.getChildBox(17).style.background="url("+othercolor+") no-repeat";
		colorBox.getChildBox(17).style.backgroundSize="60% 60%";
		colorBox.getChildBox(17).style.backgroundPosition="center";
		colorField.appendChild(colortool);
		colorField.appendChild(colors);

		this.AdditionalTools.push(colorField);
		additionalTool.appendChild(colorField);

		header.appendChild(vtool);
		header.appendChild(additionalTool);
		document.body.appendChild(header);
		header.style.display="none";
		this.pop=false;

		this.element.addEventListener("mouseup",FocusSelection);
		function FocusSelection(e){
			// body...
			const selection = window.getSelection().toString().trim();
			if(selection.length){

				header.style.top = (e.pageY)+"px";
				this.rec_m_locY = e.pageY;
				var mul = parseInt(e.pageX) +330;
				if (mul < window.screen.availWidth) {
					header.style.left = e.pageX+"px";
					this.rec_m_locX = e.pageX;
				}else{
					header.style.left = (window.screen.availWidth-410)+"px";
					this.rec_m_locX = window.screen.availWidth-410;
				}

				if (e.pageY + 230 > window.screen.availHeight) {
					this.reversalDisplay=true;
				}else{
					this.reversalDisplay=false;
				}
				
				header.style.display="flex";
				this.pop=true;
			}
				
			
		};
		
		
		this.headerE = header;
	}
	//make legend field
	createFieldSet(element,title){
		var f = $_create("fieldset");
		f.style.margin="5px";
		f.style.border="0";
		var l = $_create("legend");
		l.innerHTML = title;
		l.style.marginLeft="2px";
		f.appendChild(l);
		f.appendChild(element);
		return f;
	}
	
	//down field
	downField(ele,width,height){
		var field = $_create("button");
		field.style.width=width+"px";
		field.style.height=height+"px";
		field.style.display="flex";
		field.style.cursor="pointer";
		field.style.border="0";
		field.style.outline="0";
		field.style.padding="0px 1px";
		var down = $_create("button");
		down.style.border="0";
		down.style.outline="0";
		down.style.width="30%";
		down.style.height="90%";
		down.style.margin="5% 0%";
		down.style.background="url(/JNine-itech/cms-web-design-texteditor/Img/down.png) no-repeat";
		down.style.backgroundSize="80%";
		down.style.backgroundPosition="center";
		down.style.backgroundColor="silver";
		down.style.cursor="pointer";
		down.classList.add("down");
		
		ele.style.width="70%";
		ele.style.height="90%";
		ele.style.margin="5% 0%";
		ele.style.border="1px solid silver";


		field.appendChild(ele);
		field.appendChild(down);
		return field;
	}
	
	//main text editor
	generateEditor(){
		this.element.setAttribute("contenteditable","true");
		this.element.style.outline="0";
		this.execEditor();
		this.mouseHoverAction();
	}
	
	//execEditor
	execEditor(){
		let buttons = $_classes('tool-btns'+this.versionID);
		for(let btn of buttons){
			btn.addEventListener("click",(e)=>{
				
				let cmd = btn.dataset['command'];
				if(cmd == 21){
					var gc = _("cc");
					var getcolor="";
					gc.click();
					gc.addEventListener("change",(e)=>{
						getcolor = gc.value;
						if (this.recordC == "fontColor") {
							document.execCommand("foreColor",false,getcolor);
							this.RestoreDefault();
						}
						if (this.recordC == "highlight") {
							document.execCommand("backColor",false,getcolor);
							this.RestoreDefault();
						}
						if (this.recordC == "background") {
							this.element.style.backgroundColor=getcolor;
							this.RestoreDefault();
						}
					});

					
				}else{
				var rec = false;
				var x = 0;
				for (var i = 0; i < this.ffb.length; i++) {
					if (this.ffb[i]) {
						rec = true;
						x = i;
					}
				}

				if (cmd != 0 && cmd !=1 && cmd !=2 && cmd !=3) {
					if (cmd !="fontColor" && cmd !="highlight" && cmd != "background") {
						if (rec) {
							var rid = this.AdditionalTools[x];
							rid.style.width="0px";
							rid.style.height="0px";
							rid.style.border="0";
							this.ffb[x]=false;
							this.headerE.style.display="none";
							this.pop=false;
							this.doAction(cmd);
							this.colorPop=false;
						}else{
							this.headerE.style.display="none";
							this.pop=false;
							this.colorPop=false;
							this.doAction(cmd);
						}
					}else{
						

						if(!this.colorPop){
							this.recordC=cmd;
							this.AdditionalTools[3].style.height="125px";
							this.colorPop=true;
							if(cmd == "fontColor"){
								this.recordColorBox[0].style.backgroundColor="#0000003b";
								this.recordColorBox[1].style.backgroundColor="transparent";
								this.recordColorBox[2].style.backgroundColor="transparent";
							}
							if(cmd == "highlight"){
								this.recordColorBox[0].style.backgroundColor="transparent";
								this.recordColorBox[1].style.backgroundColor="#0000003b";
								this.recordColorBox[2].style.backgroundColor="transparent";
							}
							if(cmd == "background"){
								this.recordColorBox[0].style.backgroundColor="transparent";
								this.recordColorBox[1].style.backgroundColor="transparent";
								this.recordColorBox[2].style.backgroundColor="#0000003b";
							}
						}else{
							if (this.recordC == cmd) {
								this.AdditionalTools[3].style.height="33px";
								for(var d of this.recordColorBox){
									d.style.backgroundColor="transparent";
								}
								this.colorPop=false;
							}else{
								this.recordC=cmd;
								this.AdditionalTools[3].style.height="125px";
								this.colorPop=true;
								if(cmd == "fontColor"){
									this.recordColorBox[0].style.backgroundColor="#0000003b";
									this.recordColorBox[1].style.backgroundColor="transparent";
									this.recordColorBox[2].style.backgroundColor="transparent";
								}
								if(cmd == "highlight"){
									this.recordColorBox[0].style.backgroundColor="transparent";
									this.recordColorBox[1].style.backgroundColor="#0000003b";
									this.recordColorBox[2].style.backgroundColor="transparent";
								}
								if(cmd == "background"){
									this.recordColorBox[0].style.backgroundColor="transparent";
									this.recordColorBox[1].style.backgroundColor="transparent";
									this.recordColorBox[2].style.backgroundColor="#0000003b";
								}
							}
							
						}
						
					}
					
				}else{
					if (rec) {
						var rid = this.AdditionalTools[x];
						rid.style.width="0px";
						rid.style.height="0px";
						rid.style.border="0";
						this.ffb[x]=false;
						this.colorPop=false;
						this.AdditionalTools[x].style.width="0";
							this.AdditionalTools[x].style.height="0";
						if (cmd != x) {
							this.doAddAction(cmd);
						}
					}else{
						this.doAddAction(cmd);
					}
					
				}
				
				
			}	
				
			});
		}
	}
	//additional action
	doAddAction(cmd){
		var xx = this.headerE.offsetTop;
		if (xx + 230 > window.screen.availHeight) {
		//	this.reversalDisplay=true;
		}else{
		//	this.reversalDisplay=false;
		}
		if (cmd == 0) {
			if (this.reversalDisplay) {
				this.AdditionalTools[0].style.margin="-85px 0px 0px 70px";
			}
			this.AdditionalTools[0].style.width="90px";
			this.AdditionalTools[0].style.height="50px";
			this.AdditionalTools[0].style.border="1px solid silver";

			this.ffb[0]=true;
		}
		if (cmd == 1) {
			if (this.reversalDisplay) {
				this.AdditionalTools[1].style.margin="-85px 0px 0px 120px";
			}
			this.AdditionalTools[1].style.width="60px";
			this.AdditionalTools[1].style.height="50px";
			this.AdditionalTools[1].style.border="1px solid silver";
			this.ffb[1]=true;
		}
		if (cmd == 2) {
			if (this.reversalDisplay) {
				this.AdditionalTools[2].style.margin="-85px 0px 0px 20px";
			}
			this.AdditionalTools[2].style.width="120px";
			this.AdditionalTools[2].style.height="50px";
			this.AdditionalTools[2].style.border="1px solid silver";
			this.ffb[2]=true;
		}
		if (cmd == 3) {
			if (this.reversalDisplay) {
				this.AdditionalTools[3].style.margin="-65px 0px 0px 35px";
			}
			this.AdditionalTools[3].style.width="195px";
			this.AdditionalTools[3].style.height="33px";
			this.ffb[3]=true;
		}
		

	}
	//color
	getColor(index){
		var colorX=colorSource[index-4];
		return colorX;
	}
	//Restore
	RestoreDefault(){
		this.headerE.style.display="none";
		for (var i = 0; i < this.AdditionalTools.length; i++) {
			this.AdditionalTools[i].style.width="0px";
			this.AdditionalTools[i].style.height="0px";
		}
		for (var i = 0; i < this.ffb.length; i++) {
			this.ffb[i]=false;
		}
		for (var i = 0; i < this.recordColorBox.length; i++) {
			this.recordColorBox[i].style.backgroundColor="transparent";
		}
		this.colorPop=false;
		this.pop=false;
		this.recordC="";
	}
	//small action
	doAction(cmd){

		if (cmd == "close") {
			this.headerE.style.display="none";
			this.pop=false;
			this.colorPop=false;
		}
		var cb = false;
		if (cmd == 4 || cmd == 5 
			|| cmd == 6 || cmd == 7 || cmd == 8 || cmd == 9 || cmd == 10 || cmd == 11 || cmd == 12 || cmd == 13 
			|| cmd == 14 || cmd == 15 || cmd == 16 || cmd == 17 || cmd == 18 || cmd == 19 || cmd == 20 || cmd == 21) {
			cb=true;
		}
		if (cmd === "createLink" || cmd === "foreColor" || cmd === "fontSize" || cmd === "fontName" || cmd == 4 || cmd == 5 
			|| cmd == 6 || cmd == 7 ||cmd== 8 || cmd == 9 || cmd == 10 || cmd == 11 || cmd == 12 || cmd == 13 
			|| cmd == 14 || cmd == 15 || cmd == 16 || cmd == 17 || cmd == 18 || cmd == 19 || cmd == 20 || cmd == 21 ) {
				if (cmd === "createLink") {
					let url = prompt("Enter link address : ","https:\/\/");
					if (url.length > 7) {
						document.execCommand(cmd,false,url);
					}
					
					
				}
				if (cmd === "foreColor") {
					
				}
				if (cmd === "fontSize") {
					let size = prompt("Font size : ","");
					document.execCommand(cmd,false,size);
				}
				if (cmd === "fontName") {
					let name = prompt("Font-family : ","");
					document.execCommand(cmd,false,name);
				}
				if (cb) {
					var getcolor="";
					if (cmd != 21) {
						getcolor = this.getColor(cmd);
					}else{
						var gc = _("cc");
						gc.click();
						gc.addEventListener("change",(e)=>{
							getcolor = gc.value;
						});
					}

					if (this.recordC == "fontColor") {
						document.execCommand("foreColor",false,getcolor);
						this.recordC="";
					}
					if (this.recordC == "highlight") {
						document.execCommand("backColor",false,getcolor);
						this.recordC="";
					}
					if (this.recordC == "background") {
						this.element.style.backgroundColor=getcolor;
						this.recordC="";
					}
				}
				
				this.RestoreDefault();
		}else{
			document.execCommand(cmd,false,null);
			this.RestoreDefault();
		}

		if (cmd == "Square") {
			if (this.listB) {
				document.execCommand("undo",false,null);
			}
			document.execCommand("insertUnorderedList",false,null);
			var current = window.getSelection().focusNode.parentNode;
			current.style.listStyle="square";
			if (current.tagName != this.element) {
				current.style.listStyle="decimal";
			}
			this.listB = true;
		}

		if (cmd == "Circle") {
			if (this.listB) {
				document.execCommand("insertUnorderedList",false,null);
			}
			this.listB=true;
			document.execCommand("insertUnorderedList",false,null);
			var current = window.getSelection().focusNode.parentNode;
			if (current != this.element) {
				current.style.listStyle="disc";
			}

		}

		if (cmd == "Numerical") {
			if (this.listB) {
				document.execCommand("insertUnorderedList",false,null);
			}
			this.listB=true;
			document.execCommand("insertUnorderedList",false,null);
			var current = window.getSelection().focusNode.parentNode;
			console.log(window.getSelection().focusNode.parentNode);
			if (current != this.element) {
				current.style.listStyle="decimal";
			}
		}
		if (cmd == "UA") {
			if (this.listB) {
				document.execCommand("insertUnorderedList",false,null);
			}
			this.listB=true;
			document.execCommand("insertUnorderedList",false,null);
			var current = window.getSelection().focusNode.parentNode;
			if (current != this.element) {
				current.style.listStyle="upper-alpha";
			}
		}
		if (cmd == "LA") {
			if (this.listB) {
				document.execCommand("insertUnorderedList",false,null);
			}
			this.listB=true;
			document.execCommand("insertUnorderedList",false,null);
			var current = window.getSelection().focusNode.parentNode;
			if (current != this.element) {
				current.style.listStyle="lower-alpha";
			}
		}
		if (cmd == "UR") {
			if (this.listB) {
				document.execCommand("insertUnorderedList",false,null);
			}
			this.listB=true;
			document.execCommand("insertUnorderedList",false,null);
			var current = window.getSelection().focusNode.parentNode;
			if (current != this.element) {
				current.style.listStyle="upper-roman";
			}
		}
		if (cmd == "LR") {
			if (this.listB) {
				document.execCommand("insertUnorderedList",false,null);
			}
			this.listB=true;
			document.execCommand("insertUnorderedList",false,null);
			var current = window.getSelection().focusNode.parentNode;
			if (current != this.element) {

				current.style.listStyle="lower-roman";
			}
		}
		if(cmd == "Spacing"){
			var text = window.getSelection();
			var span = $_create("span");
			var xx = prompt("Enter space : ");
			span.style.letterSpacing=xx+"px";
			span.classList.add("qr-edit");
			span.textContent = text.toString();

			var rang = text.getRangeAt(0);
			rang.deleteContents();
			rang.insertNode(span);
		}
		if (cmd == "Shadow") {
			var currentSelected = window.getSelection();
			var currentTOP = currentSelected.focusNode.parentNode.innerText;
			var currentTOS = currentSelected.toString();
			console.log(currentTOS,currentTOP);
			if (currentTOP == currentTOS) {
				var sh = prompt("Enter text Shadow : ");
				currentSelected.focusNode.parentNode.style.textShadow=sh;
			}else{
				var span = $_create("span");
				var xx = prompt("Enter text Shadow : ");
				span.style.textShadow=xx;
				span.textContent = currentSelected.toString();

				var rang = currentSelected.getRangeAt(0);
				rang.deleteContents();
				rang.insertNode(span);
			}
		}
		
	}
	//checkFocus
	checkFocus(){

	}
	//All Done
	Done(){
		this.element.removeAttribute("contenteditable");

	}
	//Mouse Action
	mouseHoverAction(){
		var T = $_classes('tool-btns'+this.versionID);
		for (var i = 0; i < T.length; i++) {
			var to = T[i];
			to.addEventListener('mouseover',(e)=>{
				var x = e.target;
				var rc = x.classList[0];
				if (rc != "down") {
					x.style.backgroundColor="#0000003b";
				}
				

			});
			to.addEventListener('mouseout',(e)=>{
				var x = e.target;
				var rc = x.classList[0];
				if (rc != "down") {
					x.style.backgroundColor="transparent";
				}
			});
		}
			
	}
	//Current version
	get version(){
		return this.versionID;
	}
	//get editor tool field
	get toolGenerator(){
		return this.headerE;
	}
}
