class Title {
  constructor(operation) {
    this.content = {};
    this.text = '';
    this.style = {};
    this.title=operation;
  }

  /**
   * Retorna la estructura de un text
   * @returns {Title.content}
   */
  output() {
    this.text = this.title;
    this.style = 'h1';

    this.content.text = this.text;
    this.content.style = this.style;

    return this.content
  }

}

module.exports = Title;