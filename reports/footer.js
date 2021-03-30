// ARRIVAL DRAFT NORT-NORA
class Footer {
    constructor() {
       
        
      this.widths = ['*'];
  
      this.body = [
       
        [{text:'',border:[false,false,false,false]}],
        [{text:'',border:[false,false,false,false]}],
        [{canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 3,color:'#004A84',alignment: 'center'}],border:[false,false,false,false],style: {color:'#004A84'}}],
        [{text:'Banking District, 50th street, Global Plaza Tower, 19th Floor, Suite H, Panama City, Panama.', style: {bold: true},alignment: 'center',border:[false,false,false,false]}],
        [{text:'Phones: Panama: +507-8365338/ USA: +1-832-3399910 -- +1-832-6447201 / Argentina: +54-11-59841459 / Mexico: +52-55-53508581 ', style: {bold: true},alignment: 'center',border:[false,false,false,false]}],
        [{text:'e-mail: ops@miex.com', style: {bold: true},alignment: 'center',border:[false,false,false,false]}],
       
      ];
      this.style = {fontSize: 5,color: '#85929E'};
      this.layout = {
        // hLineColor: (i, node) => '#A6A6A6',
        // vLineColor: (i, node) => '#A6A6A6',
        
      };
      this.table = {};
      this.content = {};
    }
  
    /**
     * Retorna la estructura de una tabla
     * @returns {DescriptionTable.content}
     */
    output() {
      this.table.widths = this.widths;
      this.table.body = this.body;
  
      this.content.layout = this.layout;
      this.content.style = this.style;
      this.content.table = this.table;
  
      return this.content;
    }
  }
  
  module.exports = Footer;