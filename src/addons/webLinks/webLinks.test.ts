/**
 * Copyright (c) 2017 The xterm.js authors. All rights reserved.
 * @license MIT
 */

import { assert } from 'chai';

import * as webLinks from './webLinks';

class MockTerminal {
  public regex: RegExp;
  public handler: (event: MouseEvent, uri: string) => void;
  public options?: any;

  public registerLinkMatcher(regex: RegExp, handler: (event: MouseEvent, uri: string) => void, options?: any): number {
    this.regex = regex;
    this.handler = handler;
    this.options = options;
    return 0;
  }
}

describe('webLinks addon', () => {
  describe('apply', () => {
    it('should do register the `webLinksInit` method', () => {
      webLinks.apply(<any>MockTerminal);
      assert.equal(typeof (<any>MockTerminal).prototype.webLinksInit, 'function');
    });
  });

  describe('should allow simple URI path', () => {
    it('foo.com', () => {
      const term = new MockTerminal();
      webLinks.webLinksInit(<any>term);

      const row = '  http://foo.com  ';

      const match = row.match(term.regex);
      const uri = match[term.options.matchIndex];

      assert.equal(uri, 'http://foo.com');
    });

    it('bar.io', () => {
      const term = new MockTerminal();
      webLinks.webLinksInit(<any>term);

      const row = '  http://bar.io  ';

      const match = row.match(term.regex);
      const uri = match[term.options.matchIndex];

      assert.equal(uri, 'http://bar.io');
    });
  });

  describe('should allow ~ character in URI path', () => {
    it('foo.com', () => {
      const term = new MockTerminal();
      webLinks.webLinksInit(<any>term);

      const row = '  http://foo.com/a~b#c~d?e~f  ';

      const match = row.match(term.regex);
      const uri = match[term.options.matchIndex];

      assert.equal(uri, 'http://foo.com/a~b#c~d?e~f');
    });

    it('bar.io', () => {
      const term = new MockTerminal();
      webLinks.webLinksInit(<any>term);

      const row = '  http://bar.io/a~b#c~d?e~f  ';

      const match = row.match(term.regex);
      const uri = match[term.options.matchIndex];

      assert.equal(uri, 'http://bar.io/a~b#c~d?e~f');
    });
  });

  describe('should allow : character in URI path', () => {
    it('foo.com', () => {
      const term = new MockTerminal();
      webLinks.webLinksInit(<any>term);

      const row = '  http://foo.com/colon:test  ';

      const match = row.match(term.regex);
      const uri = match[term.options.matchIndex];

      assert.equal(uri, 'http://foo.com/colon:test');
    });

    it('bar.io', () => {
      const term = new MockTerminal();
      webLinks.webLinksInit(<any>term);

      const row = '  http://bar.io/colon:test  ';

      const match = row.match(term.regex);
      const uri = match[term.options.matchIndex];

      assert.equal(uri, 'http://bar.io/colon:test');
    });
  });

  describe('should not allow : character at the end of a URI path', () => {
    it('foo.com', () => {
      const term = new MockTerminal();
      webLinks.webLinksInit(<any>term);

      const row = '  http://foo.com/colon:test:  ';

      const match = row.match(term.regex);
      const uri = match[term.options.matchIndex];

      assert.equal(uri, 'http://foo.com/colon:test');
    });

    it('bar.io', () => {
      const term = new MockTerminal();
      webLinks.webLinksInit(<any>term);

      const row = '  http://bar.io/colon:test:  ';

      const match = row.match(term.regex);
      const uri = match[term.options.matchIndex];

      assert.equal(uri, 'http://bar.io/colon:test');
    });
  });

  describe('should not allow " character at the end of a URI enclosed with ""', () => {
    it('foo.com', () => {
      const term = new MockTerminal();
      webLinks.webLinksInit(<any>term);

      const row = '"http://foo.com/"';

      const match = row.match(term.regex);
      const uri = match[term.options.matchIndex];

      assert.equal(uri, 'http://foo.com/');
    });

    it('bar.io', () => {
      const term = new MockTerminal();
      webLinks.webLinksInit(<any>term);

      const row = '"http://bar.io/"';

      const match = row.match(term.regex);
      const uri = match[term.options.matchIndex];

      assert.equal(uri, 'http://bar.io/');
    });
  });

  describe('should not allow \' character at the end of a URI enclosed with \'\'', () => {
    it('foo.com', () => {
      const term = new MockTerminal();
      webLinks.webLinksInit(<any>term);

      const row = '\'http://foo.com/\'';

      const match = row.match(term.regex);
      const uri = match[term.options.matchIndex];

      assert.equal(uri, 'http://foo.com/');
    });

    it('bar.io', () => {
      const term = new MockTerminal();
      webLinks.webLinksInit(<any>term);

      const row = '\'http://bar.io/\'';

      const match = row.match(term.regex);
      const uri = match[term.options.matchIndex];

      assert.equal(uri, 'http://bar.io/');
    });
  });

  describe('should allow + character in URI path', () => {
    it('foo.com', () => {
      const term = new MockTerminal();
      webLinks.webLinksInit(<any>term);

      const row = 'http://foo.com/subpath/+/id';

      const match = row.match(term.regex);
      const uri = match[term.options.matchIndex];

      assert.equal(uri, 'http://foo.com/subpath/+/id');
    });

    it('bar.io', () => {
      const term = new MockTerminal();
      webLinks.webLinksInit(<any>term);

      const row = 'http://bar.io/subpath/+/id';

      const match = row.match(term.regex);
      const uri = match[term.options.matchIndex];

      assert.equal(uri, 'http://bar.io/subpath/+/id');
    });
  });
});
