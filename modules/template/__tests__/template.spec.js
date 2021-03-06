import template from '../src/main'

describe('template', () => {
  test('should have template', () => {
    expect(template).toBeObject()
  })

  test('should works with compile', () => {
    const format = template.compile('Hello {name}!')
    const result = format({ name: 'world' })
    expect(result).toEqual('Hello world!')
  })

  test('should works without arguments', () => {
    const result = template.render('Hello, how are you?')
    expect(result).toEqual('Hello, how are you?')
  })

  test('should works with underscores arguments', () => {
    const result = template.render('Hello {FULL_NAME}, how are you?', {
      FULL_NAME: 'James Bond'
    })
    expect(result).toEqual('Hello James Bond, how are you?')
  })

  test('interpolates values in arguments', () => {
    const data = { foo: 'bar' }
    expect(template.render('{foo}', data)).toEqual('bar')
    expect(template.render('{ foo}', data)).toEqual('bar')
    expect(template.render('{foo }', data)).toEqual('bar')
    expect(template.render('{ foo }', data)).toEqual('bar')
  })

  test('should replace named arguments', () => {
    const result = template.render('Hello {name}!', { name: 'world' })
    expect(result).toEqual('Hello world!')
  })

  test('should replace named arguments at the start of string', () => {
    const result = template.render('{name} is the best.', { name: 'John' })
    expect(result).toEqual('John is the best.')
  })

  test('should replace named arguments at the end of string', () => {
    const result = template.render('Hello {name}', { name: 'world' })
    expect(result).toEqual('Hello world')
  })

  test('should replace multiple named arguments', () => {
    const result = template.render(
      'Hello {name}, you have {emails} new messages',
      {
        name: 'Anna',
        emails: 5
      }
    )
    expect(result).toEqual('Hello Anna, you have 5 new messages')
  })

  test('should works with nested values', () => {
    expect(
      template.render('{ foo }, { bar.baz }!', {
        foo: 'Hello',
        bar: { baz: 'World' }
      })
    ).toEqual('Hello, World!')

    expect(
      template.render('{ foo }, { bar.baz.qux }!', {
        foo: 'Hello',
        bar: { baz: { qux: 'World' } }
      })
    ).toEqual('Hello, World!')
  })

  test('should use empty string when missing named arguments', () => {
    const result = template.render('Hello{name}, how are you?', {})
    expect(result).toEqual('Hello, how are you?')
  })

  test('should excape named arguments', () => {
    const result = template.render('Hello {{name}}, how are you?', {
      name: 'Mark'
    })
    expect(result).toEqual('Hello {name}, how are you?')
  })

  test('should replace array arguments', () => {
    const result = template.render('Hello {0}, how are you?', ['Mark'])
    expect(result).toEqual('Hello Mark, how are you?')
  })

  test('should replace array arguments at the start of strings', () => {
    const result = template.render('{0} people have liked this', [123])

    expect(result).toEqual('123 people have liked this')
  })

  test('should replace array arguments at the end of string', () => {
    const result = template.render('Please respond by {0}', ['01/01/2015'])

    expect(result).toEqual('Please respond by 01/01/2015')
  })

  test('should replace multiple array arguments', () => {
    const result = template.render('Hello {0}, you have {1} new messages', [
      'Anna',
      5
    ])

    expect(result).toEqual('Hello Anna, you have 5 new messages')
  })

  test('should replace empty string if missing array arguments', () => {
    const result = template.render('Hello{0}, how are you?', [])
    expect(result).toEqual('Hello, how are you?')
  })

  test('should escape array arguments', () => {
    const result = template.render('Hello {{0}}, how are you?', ['Mark'])
    expect(result).toEqual('Hello {0}, how are you?')
  })

  test('should not access array keys', () => {
    const result = template.render('Function{splice}', [])
    expect(result).toEqual('Function')
  })

  test('should replace listed arguments', () => {
    const result = template.render('Hello {0}, how are you?', 'Mark')
    expect(result).toEqual('Hello Mark, how are you?')
  })

  test('should replace listed arguments at the start of strings', () => {
    const result = template.render('{0} people have liked this', 123)

    expect(result).toEqual('123 people have liked this')
  })

  test('should replace listed arguments at the end of string', () => {
    const result = template.render('Please respond by {0}', '01/01/2015')

    expect(result).toEqual('Please respond by 01/01/2015')
  })

  test('should replace multiple listed arguments', () => {
    const result = template.render(
      'Hello {0}, you have {1} new messages',
      'Anna',
      5
    )

    expect(result).toEqual('Hello Anna, you have 5 new messages')
  })

  test('should replace missing listed arguments with empty string', () => {
    const result = template.render('Hello{1}, how are you?', 'no')
    expect(result).toEqual('Hello, how are you?')
  })

  test('should escape listed arguments', () => {
    const result = template.render('Hello {{0}}, how are you?', 'Mark')
    expect(result).toEqual('Hello {0}, how are you?')
  })

  test('should allow null data', () => {
    const result = template.render('Hello{0}', null)
    expect(result).toEqual('Hello')
  })

  test('should allow undefined data', () => {
    const result1 = template.render('Hello{0}')
    const result2 = template.render('Hello{0}', undefined)
    expect(result1).toEqual('Hello')
    expect(result2).toEqual('Hello')
  })

  test('should replace null keys with empty string', () => {
    const result1 = template.render('Hello{name}', { name: null })
    const result2 = template.render('Hello{0}', [null])
    const result3 = template.render('Hello{0}{1}{2}', null, null, null)
    expect(result1).toEqual('Hello')
    expect(result2).toEqual('Hello')
    expect(result3).toEqual('Hello')
  })

  test('should replace undefined keys with empty string', () => {
    const result1 = template.render('Hello{firstName}{lastName}', {
      name: undefined
    })
    const result2 = template.render('Hello{0}{1}', [undefined])
    const result3 = template.render('Hello{0}{1}{2}', undefined, undefined)
    expect(result1).toEqual('Hello')
    expect(result2).toEqual('Hello')
    expect(result3).toEqual('Hello')
  })

  test('should works across multline strings', () => {
    const result1 = template.render('{zero}\n{one}\n{two}', {
      zero: 'A',
      one: 'B',
      two: 'C'
    })
    const result2 = template.render('{0}\n{1}\n{2}', ['A', 'B', 'C'])
    const result3 = template.render('{0}\n{1}\n{2}', 'A', 'B', 'C')
    expect(result1).toEqual('A\nB\nC')
    expect(result2).toEqual('A\nB\nC')
    expect(result3).toEqual('A\nB\nC')
  })

  test('should allow multiple references', () => {
    const result1 = template.render('{a}{b}{c}\n{a}{b}{c}\n{a}{b}{c}', {
      a: 'one',
      b: 'two',
      c: 'three'
    })
    const result2 = template.render('{0}{1}{2}\n{0}{1}{2}\n{0}{1}{2}', [
      'one',
      'two',
      'three'
    ])
    const result3 = template.render(
      '{0}{1}{2}\n{0}{1}{2}\n{0}{1}{2}',
      'one',
      'two',
      'three'
    )
    expect(result1).toEqual('onetwothree\nonetwothree\nonetwothree')
    expect(result2).toEqual('onetwothree\nonetwothree\nonetwothree')
    expect(result3).toEqual('onetwothree\nonetwothree\nonetwothree')
  })
})
