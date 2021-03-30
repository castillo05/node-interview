class EventsTableContent {
  constructor(Title,data,events, type,type2) {
   
    this.Title=Title;
    this.events = events;
    this.type = type;
    this.type2= type2;
    this.data=data;
    this.widths = ["*", 60, 60, 60, 40, 60, 60];
    this.style = {fontSize: 5};
    this.layout = {
      hLineColor: (i, node) => '#A6A6A6',
      vLineColor: (i, node) => '#A6A6A6',
      hLineWidth: (i, node) => 0.2,
      vLineWidth: (i, node) => 0.2,
      paddingTop: this.setTopMarginOfCellForVerticalCentering,
    };
    this.body = [];
    this.table = {};
    this.content = {};

    this.buildBody();
  }

  buildBody() {
    this.body.push(this.buildTitle());

    if (this.type !== 'delays_as_follows') {
      this.body.push(this.buildHeaderFirstLine());
      // this.body.push(this.buildHeaderSecondLine());
      // this.body.push(this.buildHeaderThirdLine());
    }

    this.buildData();
  }

  buildTitle() {
    
      return [
        {
          text: this.Title,
          style: {bold: true, fontSize: 6.5},
          colSpan: 7,
          alignment: 'center'
        }, '', '', '', '', '', ''
      ];
   
  }

  buildHeaderFirstLine() {
    return [
      {
        text: 'Titulo',
        style: {bold: true, color: '#ffffff'},
        colSpan: 1,
        alignment: 'center',
        fillColor: '#004A84'
      },
      {
        text: 'Anunciante',
        style: {bold: true, color: '#ffffff'},
        colSpan: 1,
        alignment: 'center',
        fillColor: '#004A84'
      }, 
      {
        text: 'Telefonos',
        style: {bold: true, color: '#ffffff'},
        colSpan: 1,
        alignment: 'center',
        fillColor: '#004A84'
      }, 
      {
        text: 'Precio',
        style: {bold: true, color: '#ffffff'},
        colSpan: 1,
        alignment: 'center',
        fillColor: '#004A84'
      }, 
      {
        text: 'Provincia',
        style: {bold: true, color: '#ffffff'},
        colSpan: 1,
        alignment: 'center',
        fillColor: '#004A84'
      },
      {
        text: 'Ciudad',
        style: {bold: true, color: '#ffffff'},
        rowSpan: 1,
        alignment: 'center', fillColor: '#004A84'
      },
      {
        text: 'Habitaciones',
        style: {bold: true, color: '#ffffff'},
        colSpan: 1,
        rowSpan: 1,
        alignment: 'center',
        fillColor: '#004A84'
      }, 
    ];
  }

  buildHeaderSecondLine() {
    return [
      {
        text: 'START',
        style: {bold: true, color: '#ffffff'},
        colSpan: 1,
        alignment: 'center',
        fillColor: '#004A84'
      }, '',
      {
        text: 'STOP',
        style: {bold: true, color: '#ffffff'},
        colSpan: 1,
        alignment: 'center', fillColor: '#004A84'
      }, '', '', '', ''
    ];
  }

  buildHeaderThirdLine() {
    return [
      {
        text: 'DATE',
        style: {bold: true, color: '#ffffff'},
        alignment: 'center',
        fillColor: '#004A84'
      },
      {
        text: 'TIME',
        style: {bold: true, color: '#ffffff'},
        alignment: 'center', fillColor: '#004A84'
      },
      {
        text: 'DATE',
        style: {bold: true, color: '#ffffff'},
        alignment: 'center',
        fillColor: '#004A84'
      },
      {
        text: 'TIME',
        style: {bold: true, color: '#ffffff'},
        alignment: 'center',
        fillColor: '#004A84'
      }, '', '', ''
    ];
  }

  buildData() {
    
    this.data.forEach(element => {
      this.body.push([{text:element.Titulo},{text:element.Anunciante},{text:element.Telefonos},{text:'U$ '+element.Precio},{text:element.Provincia},{text:element.Ciudad},{text:element.Habitaciones},])
    })
    
  }

  output() {
    this.table.widths = this.widths;
    this.table.body = this.body;

    this.content.layout = this.layout;
    this.content.style = this.style;
    this.content.table = this.table;

    return this.content;
  }

  setTopMarginOfCellForVerticalCentering(ri, node) {
    const calcCellHeight = (cell, ci) => {
      if (cell._height !== undefined) {
        return cell._height;
      }
      let width = 0;
      for (let i = ci; i < ci + (cell.colSpan || 1); i++) {
        width += node.table.widths[i]._calcWidth;
      }
      let calcLines = (inlines) => {
        let tmpWidth = width;
        let lines = 1;
        inlines.forEach(inline => {
          tmpWidth = tmpWidth - inline.width;
          if (tmpWidth < 0) {
            lines++;
            tmpWidth = width - inline.width;
          }
        });
        return lines;
      };

      cell._height = 0;
      if (cell._inlines && cell._inlines.length) {
        let lines = calcLines(cell._inlines);
        cell._height = cell._inlines[0].height * lines;
      } else if (cell.stack && cell.stack[0] && cell.stack[0]._inlines[0]) {
        cell._height = cell.stack.map(item => {
          let lines = calcLines(item._inlines);
          return item._inlines[0].height * lines;
        }).reduce((prev, next) => prev + next);
      } else if (cell.table) {
        // TODO...
        console.log(cell);
      }

      cell._space = cell._height;
      if (cell.rowSpan) {
        for (let i = ri + 1; i < ri + (cell.rowSpan || 1); i++) {
          cell._space += Math.max(...calcAllCellHeights(i)) + 1 * (i - ri) * 2;
        }
        return 0;
      }

      ci++;
      return cell._height;
    };
    const calcAllCellHeights = (rIndex) => {
      return node.table.body[rIndex].map((cell, ci) => {
        return calcCellHeight(cell, ci);
      });
    };

    calcAllCellHeights(ri);
    const maxRowHeights = {};
    node.table.body[ri].forEach(cell => {
      if (!maxRowHeights[cell.rowSpan] || maxRowHeights[cell.rowSpan] < cell._space) {
        maxRowHeights[cell.rowSpan] = cell._space;
      }
    });

    node.table.body[ri].forEach(cell => {
      if (cell.ignored) return;

      if (cell._rowSpanCurrentOffset) {
        cell._margin = [0, 0, 0, 0];
      } else {
        let topMargin = (maxRowHeights[cell.rowSpan] - cell._height) / 2;
        if (cell._margin) {
          cell._margin[1] += topMargin;
        } else {
          cell._margin = [0, topMargin, 0, 0];
        }
      }
    });

    return 2
  }
}

module.exports = EventsTableContent;