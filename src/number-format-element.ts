class NumberFormatElement extends HTMLElement {
  static observedAttributes = ['format']

  connectedCallback() {
    this.#render()
  }

  attributeChangedCallback(name: string) {
    if (name === 'format') {
      this.#render()
    }
  }

  get locale() {
    return this.getAttribute('locale') || 'en-US'
  }

  get notation() {
    return this.getAttribute('notation') || 'compact'
  }

  get #options(): Intl.NumberFormatOptions {
    return {
      notation: this.notation as 'standard' | 'scientific' | 'engineering' | 'compact' | undefined
    }
  }

  get max() {
    return this.hasAttribute('max') ? Number(this.getAttribute('max')) : null
  }

  #render() {
    if (this.textContent) {
      const number = Number(this.textContent.replaceAll('_', ''))
      if (this.max && number > this.max) {
        this.textContent = `${new Intl.NumberFormat(this.locale, this.#options).format(this.max)}+`
      } else {
        this.textContent = new Intl.NumberFormat(this.locale, this.#options).format(number)
      }
    }
  }
}

declare global {
  interface Window {
    NumberFormatElement: typeof NumberFormatElement
  }
}

export default NumberFormatElement

if (!window.customElements.get('number-format')) {
  window.NumberFormatElement = NumberFormatElement
  window.customElements.define('number-format', NumberFormatElement)
}
