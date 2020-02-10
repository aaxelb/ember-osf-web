# ancestry-display

Display node ancestry breadcrumbs  
Truncates long titles with respect to the containing element width.


## Arguments  

- **node** | <span style="color:red"> *required* </span>  
***Node***    
Current node  

- **useLinks** | <span style="color:blue"> *optional* </span>  
***Boolean***  
Whether to link ancestors of the current node  
Default: <code>false</code>  

- **delimiter** | <span style="color:blue"> *optional* </span>  
***String***  
Delimiter to use between node titles  
Default: <code>/</code>


## One ancestor
{{handbook/gallery/components/ancestry-display/-components/demo-one-ancestor node=this.model.child}}
## Two ancestors
{{handbook/gallery/components/ancestry-display/-components/demo-two-ancestors node=this.model.grandChild}}
## More than two ancestors
{{handbook/gallery/components/ancestry-display/-components/demo-two-plus-ancestors node=this.model.greatGrandChild}}
## delimiter
{{handbook/gallery/components/ancestry-display/-components/demo-delimiter node=this.model.grandChild}}
## useLinks
{{handbook/gallery/components/ancestry-display/-components/demo-use-links node=this.model.grandChild}}
