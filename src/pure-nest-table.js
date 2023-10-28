/**
 * nest-table
 * Copyright (c) Yuki Morishima
 * https://github.com/yu-ki-m/PureNestTable
 */
class NestTable{
    static parseMarkdown2Json = (markdown)=>{
        try{
            const lines = markdown.trim().split('\n');
            const output = [];
            let maxDepth = -1;
            let maxColumns = 0; // 最大列数

            for (const line of lines) {
                const depth = line.search(/\S/);
                maxDepth = Math.max(maxDepth, depth);

                const trimmedLine = line.trim();

                const indent = Math.floor(depth / 4);

                if (trimmedLine.includes('|')) {
                const parts = trimmedLine.split('|').map(part => part.trim());
                const title = parts[0].replace('-', '').trim();
                const data = parts.slice(1);

                // 最大列数を更新
                maxColumns = Math.max(maxColumns, data.length);

                output.push({
                    indent,
                    title,
                    data
                });
                } else {
                const title = trimmedLine.replace('-', '').trim();

                output.push({
                    indent,
                    title,
                    data: []
                });
                }
            }

            return {
                maxDepth: maxDepth >= 0 ? Math.floor(maxDepth / 4) + 1 : 0,
                maxColumns, // 最大列数
                output
            };
        }catch(e){
            console.error(e);
            return null;
        }
    }
    static parseJson2Html = (jsonData)=>{
        try{
            let th0   = `<th colspan="${jsonData.maxDepth}">${jsonData.output[0].title}</th>`;
            let th = jsonData.output[0].data.map((item, index) => {
            return `<th>${item}</th>`;
            }).join('');
            let thead = `<thead>${ th0 + th }</thead>`;

            let table = jsonData.output.map((item, index) => {
            if(index == 0) return;
            let nestTd = "";
            for(let i = 0; i < item.indent; i++) {
                nestTd += "<td class='indent'></td>";
            }

            let td0   = ``;
            if(item.data.length == 0){
                td0 = nestTd +`<td class='td' colspan="${jsonData.maxDepth + jsonData.maxColumns - item.indent}">${item.title}</td>`;
            }else{
                td0 = nestTd +`<td class='td' colspan="${jsonData.maxDepth - item.indent}">${item.title}</td>`;
            }
            let td = item.data.map((item, index) => {
                return `<td class='td' >${item}</td>`;
            }).join('');
            let tr = `<tr>${ td0 + td }</tr>`;
            return tr;
            }).join('');
            let tbody = `<tbody>${ table }</tbody>`;
            let style = `<style>
            table.nest-table { 
                border-top: none;
                border-right:1px solid #b1b1b1; 
                border-bottom:1px solid #b1b1b1;
                border-left: none;
                border-spacing:0px; 
            }
            table.nest-table>thead>tr>th{
                border-top: 1px solid #b1b1b1;
                border-right:none;
                border-bottom:none;
                border-left:1px solid #b1b1b1;
            }
            table.nest-table .td{
                border-top: 1px solid #b1b1b1;
                border-right:none;
                border-bottom:none;
                border-left:1px solid #b1b1b1;
            }
            table.nest-table>tbody>tr>td.indent{
                border-top: none;
                border-right:none;
                border-bottom:none;
                border-left:1px solid #b1b1b1;
            }

            .nest-table tbody tr{
                transition: background-color 0.2s ease-out;
            }
            .nest-table td{ 
                min-width:1.5rem; 
                padding:0.0725rem 0.5rem;
            }
            .nest-table tbody tr:hover{
                background-color:#f3f4f6;
            }
            .nest-table th{ 
                min-width:1.5rem; 
                padding:0.25rem 0.5rem;
                background-color:#e5e7eb;
            }
            </style>`;
            let tableHtml = style+`<table class='nest-table'>${ thead + tbody }</table>`;
            return tableHtml;
        }catch(e){
            console.error(e);
            return ``;
        }
    }
    
    static parseMarkdown2Html = (markdown)=>{
        try{
            const parsedJson = NestTable.parseMarkdown2Json(markdown);
            const tableHtml = NestTable.parseJson2Html(parsedJson);
            return tableHtml;
        }catch(e){
            console.error(e);
            return ``;
        }
    }
}
