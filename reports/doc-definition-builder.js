class DocDefinitionBuilder {

  // Para formatear los INDENT usando tablas
  layout_sin_lineas = {
    hLineWidth: function (i, node) {
      return 0;
    },
    vLineWidth: function (i, node) {
      return 0;
    }
  };

  // Para formatear los INDENT usando tablas
  layout_no_padding = {
    paddingLeft: function (i, node) {
      return 0;
    },
    paddingRight: function (i, node) {
      return 0;
    },
    paddingTop: function (i, node) {
      return 0;
    },
    paddingBottom: function (i, node) {
      return 0;
    }
  };

  constructor(worksheet) {
    this.worksheet = worksheet; //TODO remover property
    this.imgSizeReader = new ImageSizeReader();
    this.docDefinition = {
      pageSize: 'LETTER'
    };
    this.stacks = [];
    this.stackSections = [];
    this.headerContent = [];
    this.contents = [];
    this.footerContent = [];

    this.indent = 0;
    this.indentStep = 20;

    // Estilos globales de la pagina
    this.defaultStyle = {
      color: 'black',
      fontSize: 10,
      lineHeight: 1,
      font: 'Helvetica'
    };

    this.styles = {
      h1: {
        bold: true,
        color: '#004A84',
        lineHeight: 1,
        alignment: 'center'
      },
    };

    this.pageMargins = [15, 80, 15, 15];

    // this.buildHeaderImage();
  }

  // add content into document
  addContent(content) {
    if (!content.output || typeof content.output !== "function") throw new Error('content output method not exist')

    const output = content.output();

    if (this.indent == 0) {
      this.contents[this.contents.length] = output;
    } else {
      this.contents[this.contents.length] = {
        table: {
          headerRows: 0,
          widths: [this.indentStep * this.indent, '*'],
          body: [['', output]]
        },
        layout: {...this.layout_no_padding, ...this.layout_sin_lineas}
      };
    }
  };

  /**
   * Envia lo acumulado a un STACK individual
   * @returns {undefined}
   */
  pushStack() {
    this.stacks[this.stacks.length] = {stack: this.contents};
    this.contents = [];
    this.indent = 0;
  };

  /**
   * Retorna la definicion de documento utilizada por PDFMake
   * Debe ejecutar pushStack() antes de esta parte para que lo acumulado sea incluido en la salida
   * @returns {DocumentDefinition.docDefinition}
   */
  output() {
    this.docDefinition.styles = this.styles;
    this.docDefinition.defaultStyle = this.defaultStyle;
    this.docDefinition.header = [{stack: this.headerContent}];
    this.docDefinition.content = [{stack: this.stacks}];
    this.docDefinition.footer = [{stack: this.footerContent}];
    this.docDefinition.pageMargins = this.pageMargins;
    return this.docDefinition;
  };

  buildHeaderImage() {
    const zoom = 0.66;
    const format = {margin: 12};
    const img64 = '';

    this.headerContent[this.headerContent.length] = this.base64ImageFormat(img64, zoom, format);
    this.newLine();
  };

  newLine() {
    this.contents[this.contents.length] = {text: '\n', margin: [0, 0, 0, 0]};
  };

  newPage() {
    if ((this.contents.length > 0) || (this.stacks.length > 0)) {
      this.contents[this.contents.length] = {text: '', pageBreak: 'after'};
    }
  };

  base64ImageFormat(img64, zoom, props) {
    const image = this.getImage(img64);

    if (typeof zoom === 'undefined') {
      zoom = 1;
    }

    if (zoom != null) {
      image.width *= zoom;
      image.height *= zoom;
    }

    return {...image, ...props};
  };

  getImage(contentBase64) {
    const output = this.imgSizeReader.getDimensions(contentBase64);

    output.image = contentBase64;
    output.width *= 0.75;
    output.height *= 0.75;

    return output;
  };
}

/***************************************/
/* to read image sizes */

/***************************************/
class ImageSizeReader {

  read_4_bytes(bytes, index) {
    return (bytes[index] << 24) | (bytes[index + 1] << 16) | (bytes[index + 2] << 8) | bytes[index + 3];
  };

  read_2_bytes(bytes, index) {
    return (bytes[index] << 8) | bytes[index + 1];
  };

  getPngDimensions(b) {
    return {width: this.read_4_bytes(b, 16), height: this.read_4_bytes(b, 20)};
  };

  getJpegDimensions(b) {
    let nIndex;
    let height = 0;
    let width = 0;
    let size = 0;
    let nSize = b.length;

    // marker FF D8  starts a valid JPEG
    if (this.read_2_bytes(b, 0) === 0xFFD8) {
      for (nIndex = 2; nIndex < nSize - 1; nIndex += 4) {
        console.log(b[nIndex] === 0xFF/*FF*/ && b[nIndex + 1] === 0xC0);
        if (b[nIndex] === 0xFF/*FF*/ && b[nIndex + 1] === 0xC0 /*C0*/) {
          const w = this.read_2_bytes(b, nIndex + 7);
          const h = this.read_2_bytes(b, nIndex + 5);
          if (w * h > size) {
            size = w * h;
            width = w;
            height = h;
          }
        }
      }
    }
    return {width: width, height: height};
  };

  getDimensions(dataURI) {
    const def = {width: 0, height: 0};

    if ((dataURI === '') || (dataURI === null)) {
      return def;
    }


    try {
      // convert base64 to raw binary data held in a string
      const byteString = Buffer.from(dataURI.split(',')[1], 'base64').toString('binary');
      // separate out the mime component
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      const byteArray = new Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
      }

      if (mimeString === 'image/png') {
        // PNG support
        return this.getPngDimensions(byteArray);
      } else if (mimeString === 'image/jpeg') {
        // JPEG support
        return this.getJpegDimensions(byteArray);
      }
    } catch (e) {
      throw new Error(e.message);
    }

    // Not support
    return def;
  };
}

module.exports = DocDefinitionBuilder