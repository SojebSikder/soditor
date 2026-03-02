var f=Object.defineProperty;var w=(i,e,n)=>e in i?f(i,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[e]=n;var c=(i,e,n)=>w(i,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const r of l.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function n(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function t(o){if(o.ep)return;o.ep=!0;const l=n(o);fetch(o.href,l)}})();class x{constructor(){c(this,"listeners",{})}on(e,n){this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push(n)}off(e,n){var t;this.listeners[e]=(t=this.listeners[e])==null?void 0:t.filter(o=>o!==n)}emit(e,n){var t;(t=this.listeners[e])==null||t.forEach(o=>o(n))}}const v={};function b(){return v}class h{static generateId(e="soditor"){return typeof crypto<"u"&&crypto.randomUUID?`${e}-${crypto.randomUUID()}`:`${e}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2,10)}`}static debounce(e,n){let t=null;return function(...o){t!==null&&clearTimeout(t),t=window.setTimeout(()=>e.apply(this,o),n)}}}class k{constructor(e){c(this,"editor");this.editor=e}alert(e,n="Alert"){var o;const t=h.generateId("soditor-alert-modal");(o=document.getElementById(t))==null||o.remove(),this.addModal({id:t,title:n,content:`<p>${e}</p>`,buttons:[{text:"OK",primary:!0,onClick:({closeModal:l})=>l()}]}),this.showModal(t)}promptAsync(e,n="",t="Prompt"){return new Promise(o=>{this.prompt(e,n,t,l=>o(l))})}prompt(e,n="",t="Prompt",o){var a;const l=h.generateId("soditor-prompt-modal"),r=h.generateId("soditor-prompt-modal-input");(a=document.getElementById(l))==null||a.remove(),this.addModal({id:l,title:t,content:`
      <label class="soditor-label">${e}</label>
      <input id="${r}" type="text" class="soditor-input" value="${n}" 
             style="width:100%;margin-top:8px;padding:6px;" />
    `,buttons:[{text:"Cancel",onClick:({closeModal:d})=>{d(),o(null)}},{text:"OK",primary:!0,onClick:({closeModal:d})=>{const p=document.getElementById(r);d(),o((p==null?void 0:p.value)??"")}}]}),this.showModal(l);const s=document.getElementById(r);s==null||s.focus(),s==null||s.select()}confirm(e,n="Confirm",t){const o=h.generateId("soditor-confirm-modal");this.addModal({id:o,title:n,content:`<p>${e}</p>`,buttons:[{text:"Cancel",onClick:({closeModal:l})=>{l(),t(!1)}},{text:"OK",primary:!0,onClick:({closeModal:l})=>{l(),t(!0)}}]}),this.showModal(o)}showToast(e,n="info",t=3e3){const o="soditor-toast-container";let l=document.getElementById(o);l||(l=document.createElement("div"),l.id=o,l.classList.add("soditor-toast-container"),document.body.appendChild(l));const r=document.createElement("div");r.classList.add("soditor-toast",`soditor-toast-${n}`),r.innerText=e,l.appendChild(r),setTimeout(()=>r.classList.add("show"),50),setTimeout(()=>{r.classList.remove("show"),setTimeout(()=>r.remove(),500)},t)}showLoader(e="Loading..."){const n="soditor-loader";if(document.getElementById(n))return;const t=document.createElement("div");t.id=n,t.classList.add("soditor-loader-overlay"),t.innerHTML=`
    <div class="soditor-loader-spinner"></div>
    <p>${e}</p>
  `,document.body.appendChild(t)}hideLoader(){var e;(e=document.getElementById("soditor-loader"))==null||e.remove()}showSnackbar(e,n=2500){const t=document.createElement("div");t.className="soditor-snackbar",t.innerText=e,document.body.appendChild(t),setTimeout(()=>t.classList.add("show"),50),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>t.remove(),400)},n)}addFloatingToolbar(e){const n=document.createElement("div");n.classList.add("soditor-floating-toolbar"),e.forEach(({icon:t,tooltip:o,onClick:l})=>{const r=document.createElement("button");r.classList.add("soditor-btn"),r.innerHTML=t,this.addTooltip(r,o),r.onclick=l,n.appendChild(r)}),document.body.appendChild(n)}createContextToolbar(){const e=document.createElement("div");e.id="soditor-context-toolbar",e.classList.add("soditor-context-toolbar"),Object.assign(e.style,{position:"absolute",display:"none",background:"#fff",border:"1px solid #ccc",borderRadius:"6px",padding:"4px",boxShadow:"0 2px 6px rgba(0,0,0,0.1)",zIndex:"9999",gap:"4px",alignItems:"center"});const n=(t,o,l)=>{const r=document.createElement("button");return r.innerHTML=t,r.title=o,r.classList.add("soditor-btn"),Object.assign(r.style,{border:"none",background:"#f4f4f4",cursor:"pointer",padding:"4px 6px",borderRadius:"4px"}),r.onmouseenter=()=>r.style.background="#e0e0e0",r.onmouseleave=()=>r.style.background="#f4f4f4",r.onclick=l,r};return document.body.appendChild(e),document.addEventListener("click",t=>{e.contains(t.target)||(e.style.display="none")}),{element:e,show:({x:t,y:o,buttons:l,context:r})=>{e.innerHTML="",e.context=r,l.forEach(({icon:s,title:a,onClick:d})=>{e.appendChild(n(s,a,()=>{d()}))}),e.style.left=`${t}px`,e.style.top=`${o}px`,e.style.display="flex"},hide:()=>{e.style.display="none"}}}addTooltip(e,n){e.classList.add("soditor-tooltip");const t=document.createElement("div");t.classList.add("soditor-tooltiptext"),t.innerHTML=n||"",e.appendChild(t)}addButton(e,n){const t=document.createElement("button");t.name=e,t.innerHTML=n.text||"",this.addTooltip(t,n.tooltip||""),t.setAttribute("aria-label",n.tooltip||""),t.classList.add("soditor-btn"),t.onclick=()=>{n.onAction&&(n.onAction(),this.editor.saveState())},this.editor.toolbar.appendChild(t)}addDropdown(e,n){const t=document.createElement("div");t.classList.add("soditor-dropdown");const o=document.createElement("button");o.innerHTML=n.text||e,o.setAttribute("aria-label",n.tooltip||""),o.classList.add("soditor-btn"),this.addTooltip(o,n.tooltip||"");const l=document.createElement("div");l.classList.add("soditor-dropdown-content");for(const r of n.options||[]){const s=document.createElement("a");s.innerHTML=r.label,s.onclick=()=>{r.onSelect&&(this.editor.restoreSelection(),r.onSelect(r.value),this.editor.saveSelection())},l.appendChild(s)}o.onclick=r=>{r.stopPropagation(),this.editor.saveSelection(),l.classList.toggle("soditor-show")},window.onclick=r=>{if(!r.target.matches(".soditor-btn")){const s=document.getElementsByClassName("soditor-dropdown-content");for(let a=0;a<s.length;a++)s[a].classList.contains("soditor-show")&&s[a].classList.remove("soditor-show")}},t.appendChild(o),t.appendChild(l),this.editor.toolbar.appendChild(t)}addModal({id:e,title:n,content:t,buttons:o}){var a,d,p;const l=document.createElement("div");l.id=e,l.classList.add("soditor-modal"),l.innerHTML=`
    <div class="soditor-modal-content">
      <span class="soditor-close">&times;</span>
      <h2 class="soditor-modal-title">${n}</h2>
      <div class="soditor-modal-body">${t}</div>
      <div class="soditor-modal-footer">
      ${o?o.map(m=>`<button class="soditor-btn ${m.primary?"soditor-btn-primary":""}">${m.text}</button>`).join(""):""}
      </div>
    </div>
  `,document.body.appendChild(l);const r=()=>{l.style.display="none"};(a=l.querySelector(".soditor-close"))==null||a.addEventListener("click",r),(d=l.querySelector(".soditor-modal-cancel"))==null||d.addEventListener("click",r),(p=l.querySelector(".soditor-modal-confirm"))==null||p.addEventListener("click",()=>{r()}),l.querySelectorAll(".soditor-modal-footer button").forEach((m,g)=>{o&&o[g]&&m.addEventListener("click",()=>{const y={closeModal:()=>r()};o[g].onClick(y)})}),window.addEventListener("click",m=>{m.target===l&&r()}),window.addEventListener("keydown",m=>{m.key==="Escape"&&r()})}showModal(e){const n=document.getElementById(e);n&&(n.style.display="block")}closeModal(e){const n=document.getElementById(e);n&&(n.style.display="none")}}class C{constructor(e,n){c(this,"toolbar");c(this,"editor");c(this,"plugins",[]);c(this,"ui");c(this,"maxHistory",100);c(this,"undoStack",[]);c(this,"redoStack",[]);c(this,"commands",new Map);c(this,"savedRange",null);c(this,"inputListener");c(this,"emitter",new x);if(!e||!n)throw new Error("Toolbar or Editor not found");this.toolbar=e,this.editor=n,this.toolbar.style.position="sticky",this.toolbar.style.top="0",this.toolbar.setAttribute("role","toolbar"),this.editor.setAttribute("role","textbox"),this.editor.setAttribute("contenteditable","true");const t=h.debounce(()=>{this.saveState(),this.emitter.emit("input",{html:this.editor.innerHTML})},300);this.inputListener=t,this.editor.addEventListener("input",t),this.editor.addEventListener("mouseup",()=>{this.emitter.emit("selectionchange",{range:this.getSelectionRange()})}),this.editor.addEventListener("keyup",()=>{this.emitter.emit("selectionchange",{range:this.getSelectionRange()})}),new MutationObserver(()=>{this.emitter.emit("change",{html:this.editor.innerHTML})}).observe(this.editor,{childList:!0,subtree:!0,characterData:!0});const l=b();for(const[r,s]of Object.entries(l))this.use(s);this.ui=new k(this),this.registerCommand("undo",()=>this.undo()),this.registerCommand("redo",()=>this.redo())}registerCommand(e,n){this.commands.set(e,n),this.emitter.emit("commandRegistered",{name:e})}execCommand(e,...n){const t=this.commands.get(e);if(!t){console.warn(`Command "${e}" not found`);return}this.saveSelection(),t(...n),this.saveState(),this.emitter.emit("execCommand",{command:e})}saveState(){this.undoStack.length>=this.maxHistory&&this.undoStack.shift(),this.undoStack.push(this.editor.innerHTML),this.redoStack=[],this.emitter.emit("contentChange",{html:this.editor.innerHTML})}saveSelection(){const e=window.getSelection();e.rangeCount>0&&(this.savedRange=e.getRangeAt(0))}restoreSelection(){if(this.savedRange){const e=window.getSelection();e.removeAllRanges(),e.addRange(this.savedRange)}}saveCurrentSelection(){this.saveSelection()}restoreSavedSelection(){this.restoreSelection()}on(e,n){this.emitter.on(e,n)}off(e,n){this.emitter.off(e,n)}undo(){if(this.undoStack.length>1){const e=this.undoStack.pop();this.redoStack.push(e);const n=this.undoStack[this.undoStack.length-1];this.editor.innerHTML=n}}redo(){if(this.redoStack.length>0){const e=this.redoStack.pop();this.undoStack.push(e),this.editor.innerHTML=e}}destroy(){var e;this.inputListener&&this.editor.removeEventListener("input",this.inputListener);for(const n of this.plugins)(e=n.destroy)==null||e.call(n,this),this.emitter.emit("pluginDestroy",{pluginName:n.constructor.name});this.plugins=[]}use(e){e.init(this),this.plugins.push(e),this.emitter.emit("pluginInit",{pluginName:e.constructor.name})}getSelectionRange(){const e=window.getSelection();return e!=null&&e.rangeCount?e.getRangeAt(0):null}getParentElement(){const e=window.getSelection();if(e&&e.rangeCount>0){const n=e.getRangeAt(0);return n.commonAncestorContainer.nodeType===Node.ELEMENT_NODE?n.commonAncestorContainer:n.commonAncestorContainer.parentElement}return null}removeParentElement(e){const n=document.createDocumentFragment(),t=e.firstChild,o=e.lastChild;for(;e.firstChild;)n.appendChild(e.firstChild);if(e.replaceWith(n),t&&o){const l=document.createRange();l.setStartBefore(t),l.setEndAfter(o);const r=window.getSelection();r&&(r.removeAllRanges(),r.addRange(l)),this.savedRange=l.cloneRange()}}insertNode(e){this.editor.appendChild(e)}exec(e){this.saveSelection();const n=this.getSelectionRange();if(!n||n.collapsed)return;const t=n.extractContents(),o=e(t),l=document.createDocumentFragment();l.appendChild(o),n.insertNode(l);const s=window.getComputedStyle(o).display==="block"||/^(DIV|P|H[1-6]|SECTION|ARTICLE|BLOCKQUOTE|UL|OL|LI)$/i.test(o.tagName),a=document.createRange();s?(a.setStartAfter(o),a.collapse(!0)):a.selectNodeContents(o);const d=window.getSelection();d&&(d.removeAllRanges(),d.addRange(a)),this.savedRange=a.cloneRange(),this.saveState(),this.emitter.emit("execCommand",{command:e.name||"unknown"})}insertContent(e){this.saveSelection();const n=document.createElement("div");n.innerHTML=e;const t=this.getSelectionRange();if(t&&!t.collapsed){t.deleteContents();const o=document.createDocumentFragment();for(;n.firstChild;)o.appendChild(n.firstChild);t.insertNode(o),t.collapse(!1);const l=window.getSelection();l==null||l.removeAllRanges(),l==null||l.addRange(t)}else for(;n.firstChild;)this.editor.appendChild(n.firstChild);this.saveState()}toHTML(){return this.editor.innerHTML}fromHTML(e){this.editor.innerHTML=e,this.saveState()}}const E={name:"colorPicker",init(i){i.ui.addButton("colorPicker",{text:`<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Color">
  <!-- Pencil tip / color drop -->
  <path d="M12 19l7-7-4-4-7 7v4h4z" />
  <!-- Optional color square / palette -->
  <rect x="2" y="20" width="4" height="4" rx="1" ry="1" />
</svg>
`,tooltip:"Text Color",onAction:()=>{const t=i.toolbar.querySelector("#soditor-color-picker-label");t&&t.click()}});const e=document.createElement("label");e.id="soditor-color-picker-label",e.style.marginLeft="8px",e.style.display="none";const n=document.createElement("input");n.type="color",n.value="#000000",n.style.marginLeft="4px",n.style.visibility="hidden",n.oninput=()=>{const t=n.value;i.exec(o=>{const l=document.createElement("span");return l.style.color=t,l.appendChild(o),l})},e.appendChild(n),i.toolbar.appendChild(e)}},S={name:"font",init(i){const e=["Arial","Courier New","Georgia","Times New Roman","Verdana","Comic Sans MS","Impact","Lucida Sans Unicode","Tahoma","Trebuchet MS"];i.ui.addDropdown("fonts",{text:`
      <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Font">
  <!-- Letter A -->
  <path d="M4 20h4l4-12h4" />
  <line x1="7" y1="16" x2="11" y2="16" />
</svg>

      `,tooltip:"Font",options:e.map(n=>({label:n,value:n,onSelect:t=>{const o=t,l=i.getParentElement();if(l&&l instanceof HTMLSpanElement){l.style.fontFamily=o;return}i.exec(r=>{const s=document.createElement("span");return s.style.fontFamily=o,s.appendChild(r),s})}}))})}},L={name:"formatting",init(i){i.registerCommand("bold",()=>{const n=i.getSelectionRange();if(!n||n.collapsed)return;const t=i.getParentElement();if((t==null?void 0:t.tagName)==="STRONG")return i.removeParentElement(t);i.exec(o=>{const l=document.createElement("strong");return l.appendChild(o),l})}),i.registerCommand("italic",()=>{const n=i.getSelectionRange();if(!n||n.collapsed)return;const t=i.getParentElement();if((t==null?void 0:t.tagName)==="EM")return i.removeParentElement(t);i.exec(o=>{const l=document.createElement("em");return l.appendChild(o),l})}),i.registerCommand("underline",()=>{const n=i.getSelectionRange();if(!n||n.collapsed)return;const t=i.getParentElement();if((t==null?void 0:t.tagName)==="U")return i.removeParentElement(t);i.exec(o=>{const l=document.createElement("u");return l.appendChild(o),l})}),i.registerCommand("insertImage",async n=>{const t=i.getSelectionRange();if(!t)return;const o=await i.ui.promptAsync("Enter image URL:"),l=n||o;if(!l)return;const r=document.createElement("img");r.src=l,r.alt="Inserted Image",r.style.maxWidth="100%",t.insertNode(r),t.setStartAfter(r),t.setEndAfter(r);const s=window.getSelection();s==null||s.removeAllRanges(),s==null||s.addRange(t)}),i.registerCommand("heading",n=>{i.exec(t=>{const o=document.createElement(n);return o.appendChild(t),o})}),i.registerCommand("align",n=>{const t=i.getSelectionRange();if(!t||t.collapsed)return;const o=i.getParentElement();o&&o instanceof HTMLElement&&(o.tagName==="P"?o.style.textAlign=n:i.exec(l=>{const r=document.createElement("p");return r.style.textAlign=n,r.appendChild(l),r}))}),i.ui.addButton("bold",{text:`
      <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Bold">
  <path d="M6 4h8a4 4 0 0 1 0 8H6z" />
  <path d="M6 12h9a4 4 0 0 1 0 8H6z" />
</svg>

      `,tooltip:"Bold",onAction:()=>i.execCommand("bold")}),i.ui.addButton("italic",{text:`
      <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Italic">
  <line x1="19" y1="4" x2="10" y2="4" />
  <line x1="14" y1="20" x2="5" y2="20" />
  <line x1="15" y1="4" x2="9" y2="20" />
</svg>

      `,tooltip:"Italic",onAction:()=>i.execCommand("italic")}),i.ui.addButton("underline",{text:`
      <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Underline">
  <path d="M6 4v6a6 6 0 0 0 12 0V4" />
  <line x1="4" y1="20" x2="20" y2="20" />
</svg>

      `,tooltip:"Underline",onAction:()=>i.execCommand("underline")}),i.ui.addButton("image",{text:`
      <!-- Image / Picture icon -->
<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Image">
  <!-- Frame -->
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  <!-- Sun / circle -->
  <circle cx="8.5" cy="8.5" r="1.5" />
  <!-- Mountains / landscape -->
  <path d="M21 15l-5-5L5 21" />
</svg>

      `,tooltip:"Insert Image",onAction:()=>i.execCommand("insertImage")}),i.ui.addDropdown("format",{text:`
      <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Format">
  <!-- Paragraph symbol P -->
  <path d="M10 4v16" />
  <path d="M10 4h6a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-6" />
</svg>

      `,tooltip:"Text format",options:["h1","h2","h3","h4","h5","h6","p"].map(n=>({label:n.toUpperCase(),value:n,onSelect:()=>i.execCommand("heading",n)}))});const e=[{label:`
<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Align Left">
  <line x1="3" y1="6" x2="21" y2="6" />
  <line x1="3" y1="12" x2="15" y2="12" />
  <line x1="3" y1="18" x2="21" y2="18" />
</svg>
        `,value:"left"},{label:`
<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Align Center">
  <line x1="4" y1="6" x2="20" y2="6" />
  <line x1="8" y1="12" x2="16" y2="12" />
  <line x1="4" y1="18" x2="20" y2="18" />
</svg>
        `,value:"center"},{label:`
<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Align Right">
  <line x1="3" y1="6" x2="21" y2="6" />
  <line x1="9" y1="12" x2="21" y2="12" />
  <line x1="3" y1="18" x2="21" y2="18" />
</svg>
        `,value:"right"},{label:`
        <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Align Justify">
  <line x1="3" y1="6" x2="21" y2="6" />
  <line x1="3" y1="12" x2="21" y2="12" />
  <line x1="3" y1="18" x2="21" y2="18" />
</svg>
        `,value:"justify"}];i.ui.addDropdown("align",{text:`
<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Align Left">
  <line x1="3" y1="6" x2="21" y2="6" />
  <line x1="3" y1="12" x2="15" y2="12" />
  <line x1="3" y1="18" x2="21" y2="18" />
</svg>
      `,tooltip:"Text alignment",options:e.map(n=>({label:n.label,value:n.value,onSelect:()=>i.execCommand("align",n.value)}))})}},M={name:"link",init(i){i.ui.addButton("myButton",{text:`
      <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Link">
  <path d="M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13" />
  <path d="M14 11a5 5 0 0 1 0 7l-1.5 1.5a5 5 0 0 1-7-7L7 11" />
</svg>
`,onAction:()=>{i.saveSelection(),i.ui.showModal("insertLinkModal");const e=document.getElementById("insertLinkModal");if(!e)return;const n=e.querySelector("#modal-link-text");let t="";i.savedRange&&(t=i.savedRange.toString()),n&&(n.value=t,n.focus());const o=e.querySelector("#modal-link-url");o&&(o.value="")},tooltip:"Insert a link"}),i.ui.addModal({id:"insertLinkModal",title:"Insert Link",content:`
    <label>URL: <input type="text" id="modal-link-url" autofocus /></label>
    <br />
    <br />
    <label>Text: <input type="text" id="modal-link-text" /></label>
  `,buttons:[{text:"Cancel",onClick:e=>{e.closeModal()}},{text:"Insert",primary:!0,onClick:e=>{const t=document.getElementById("modal-link-url").value.trim();if(t){const l=document.getElementById("modal-link-text").value.trim()||t;if(i.restoreSelection(),!i.getSelectionRange())return e.closeModal();const s=i.getParentElement();if((s==null?void 0:s.tagName)==="A")return i.removeParentElement(s),e.closeModal();i.exec(a=>{const d=document.createElement("a");return d.href=t,d.target="_blank",d.rel="noopener noreferrer",a.childNodes.length===0?d.textContent=l:d.appendChild(a),d})}e.closeModal()}}]})},destroy(i){}},T={name:"undoRedo",init(i){i.ui.addButton("undo",{text:`
      <!-- Undo / corner-left (outline) -->
<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Undo">
  <!-- arrow head -->
  <path d="M9 10 L4 15 L9 20" />
  <!-- curved path (undo tail) -->
  <path d="M20 5v6a4 4 0 0 1-4 4H4" />
</svg>

      `,tooltip:"Undo",onAction:()=>{i.undo()}}),i.ui.addButton("redo",{text:`
      <!-- Redo / corner-right (outline) -->
<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Redo">
  <!-- arrow head -->
  <path d="M15 10 L20 15 L15 20" />
  <!-- curved path (redo tail) -->
  <path d="M4 5v6a4 4 0 0 0 4 4h16" />
</svg>

      `,tooltip:"Redo",onAction:()=>{i.redo()}}),document.addEventListener("keydown",e=>{e.ctrlKey&&e.key==="z"&&i.undo(),e.ctrlKey&&e.key==="y"&&i.redo()})}},R={name:"table",init(i){i.ui.addButton("table",{text:`
      <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Table">
  <!-- Outer table frame -->
  <rect x="3" y="3" width="18" height="18" rx="1" ry="1" />
  <!-- Horizontal rows -->
  <line x1="3" y1="9" x2="21" y2="9" />
  <line x1="3" y1="15" x2="21" y2="15" />
  <!-- Vertical columns -->
  <line x1="9" y1="3" x2="9" y2="21" />
  <line x1="15" y1="3" x2="15" y2="21" />
</svg>

      `,tooltip:"Insert Table",onAction:async()=>{const n=await i.ui.promptAsync("Enter number of rows:","2","Select rows"),t=await i.ui.promptAsync("Enter number of columns:","2","Select columns"),o=parseInt(n||"0"),l=parseInt(t||"0");if(isNaN(o)||isNaN(l)||o<=0||l<=0){i.ui.alert("Invalid size!");return}I(i,o,l)}});const e=B(i);document.body.appendChild(e),i.on("selectionchange",()=>{const n=i.getParentElement(),t=A(n);if(t&&t instanceof HTMLTableCellElement){const o=t.getBoundingClientRect();e.style.display="flex",e.style.top=`${window.scrollY+o.top-40}px`,e.style.left=`${window.scrollX+o.left}px`,e.currentCell=t}else e.style.display="none"})},destroy(i){const e=document.getElementById("editor-table-toolbar");e&&e.remove()}};function I(i,e,n){const t=document.createElement("table");t.style.borderCollapse="collapse",t.style.margin="8px 0",t.style.border="1px solid #ccc",t.style.width="100%";for(let l=0;l<e;l++){const r=document.createElement("tr");for(let s=0;s<n;s++){const a=document.createElement("td");a.style.border="1px solid #ccc",a.style.padding="6px",a.style.minWidth="40px",a.contentEditable="true",a.innerHTML="&nbsp;",r.appendChild(a)}t.appendChild(r)}const o=i.getSelectionRange();if(o){o.insertNode(t),o.setStartAfter(t),o.collapse(!0);const l=window.getSelection();l&&(l.removeAllRanges(),l.addRange(o))}else i.insertNode(t);i.saveState()}function B(i){const e=document.createElement("div");e.id="editor-table-toolbar",e.style.position="absolute",e.style.display="none",e.style.background="#fff",e.style.border="1px solid #ccc",e.style.borderRadius="6px",e.style.padding="4px",e.style.boxShadow="0 2px 6px rgba(0,0,0,0.1)",e.style.zIndex="9999",e.style.gap="4px";const n=(t,o,l)=>{const r=document.createElement("button");return r.innerHTML=t,r.title=o,r.style.border="none",r.style.background="#f4f4f4",r.style.cursor="pointer",r.style.padding="4px 6px",r.style.borderRadius="4px",r.onmouseenter=()=>r.style.background="#e0e0e0",r.onmouseleave=()=>r.style.background="#f4f4f4",r.onclick=l,r};return e.appendChild(n("➕ Row","Add row below",()=>{const t=e.currentCell;if(!t)return;const o=t.parentElement,l=o.parentElement,r=o.cloneNode(!0);r.querySelectorAll("td").forEach(s=>s.innerHTML="&nbsp;"),l.insertBefore(r,o.nextSibling),i.saveState()})),e.appendChild(n("➖ Row","Delete this row",()=>{const t=e.currentCell;if(!t)return;t.parentElement.remove(),i.saveState()})),e.appendChild(n("➕ Col","Add column",()=>{const t=e.currentCell;if(!t)return;const o=Array.from(t.parentElement.children).indexOf(t);t.closest("table").querySelectorAll("tr").forEach(r=>{const s=document.createElement("td");s.style.border="1px solid #ccc",s.style.padding="6px",s.style.minWidth="40px",s.contentEditable="true",s.innerHTML="&nbsp;",r.insertBefore(s,r.children[o+1]||null)}),i.saveState()})),e.appendChild(n("➖ Col","Delete this column",()=>{const t=e.currentCell;if(!t)return;const o=Array.from(t.parentElement.children).indexOf(t);t.closest("table").querySelectorAll("tr").forEach(r=>{r.children[o]&&r.children[o].remove()}),i.saveState()})),e.appendChild(n("🗑️","Delete entire table",()=>{const t=e.currentCell,o=t==null?void 0:t.closest("table");o&&(o.remove(),e.style.display="none",i.saveState())})),e}function A(i){for(;i;){if(i instanceof HTMLTableCellElement)return i;i=i.parentElement}return null}const P={name:"contextMenu",init(i){const e=i.ui.createContextToolbar();i.editor.addEventListener("contextmenu",n=>{n.preventDefault(),e.show({x:n.pageX,y:n.pageY,context:i.editor,buttons:[{icon:"B",title:"Bold",onClick:()=>{i.execCommand("bold")}},{icon:"U",title:"Underline",onClick:()=>{i.execCommand("underline")}}]})})}},H={name:"colorPicker",init(i){i.ui.addButton("colorPicker",{text:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 21h18" />
        <path d="M14 3l7 7-6 6L8 9 14 3z" />
        <path d="M7.5 16.5l-1.5 1.5" />
      </svg>
`,tooltip:"BG Color",onAction:()=>{const t=i.toolbar.querySelector("#soditor-bg-color-picker-label");t&&t.click()}});const e=document.createElement("label");e.id="soditor-bg-color-picker-label",e.style.marginLeft="8px",e.style.display="none";const n=document.createElement("input");n.type="color",n.value="#000000",n.style.marginLeft="4px",n.style.visibility="hidden",n.oninput=()=>{const t=n.value;i.exec(o=>{const l=document.createElement("span");return l.style.backgroundColor=t,l.appendChild(o),l})},e.appendChild(n),i.toolbar.appendChild(e)}},N=document.getElementById("soditor-toolbar"),O=document.getElementById("soditor-editor"),u=new C(N,O);u.use(T);u.use(L);u.use(M);u.use(S);u.use(R);u.use(E);u.use(H);u.use(P);u.use({name:"examplePlugin",init(i){},destroy(i){console.log("Plugin cleanup!")}});
