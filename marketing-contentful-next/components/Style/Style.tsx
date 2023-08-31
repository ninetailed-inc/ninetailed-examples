import { IStyle } from '@/types/contentful';

export default function Style(props: IStyle) {
  return <style>{props.fields.css}</style>;
}
