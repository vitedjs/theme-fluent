import parse, { Element as HtmlElement, type DOMNode } from 'html-react-parser';
import type { ReactElement } from 'react';

import type { MarkdownElementProps } from '../types';
import { MarkdownCodeBlock } from './markdown-code-block';

export function MarkdownHtml({ html = '' }: MarkdownElementProps): ReactElement {
  return <>{parse(html, { replace: replaceMarkdownHtmlNode })}</>;
}

function replaceMarkdownHtmlNode(node: DOMNode) {
  if (!(node instanceof HtmlElement) || node.name !== 'pre') return;
  const codeNode = node.children.find(
    (child): child is HtmlElement => child instanceof HtmlElement && child.name === 'code',
  );
  if (!codeNode) return;
  const code = codeNode.children.map(getHtmlText).join('');
  return (
    <MarkdownCodeBlock>
      <code className={codeNode.attribs.class}>{code}</code>
    </MarkdownCodeBlock>
  );
}

function getHtmlText(node: unknown): string {
  if (typeof node === 'object' && node !== null) {
    if ('type' in node && node.type === 'text' && 'data' in node) return String(node.data);
    if (node instanceof HtmlElement) return node.children.map(getHtmlText).join('');
  }
  return '';
}
