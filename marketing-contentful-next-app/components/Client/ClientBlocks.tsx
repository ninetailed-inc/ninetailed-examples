'use client';

import {
  IBanner,
  ICta,
  IFeature,
  IFooter,
  IHero,
  IHubspotForm,
  INavigation,
  IPricingPlan,
  IPricingTable,
  ISectionsGroup,
} from '@/types/contentful';

import { Banner } from '@/components/Banner';
import { Cta } from '@/components/Cta';
import { Feature } from '@/components/Feature';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { HubspotForm } from '@/components/HubspotForm';
import { Navigation } from '@/components/Navigation';
import { PricingPlan } from '@/components/PricingPlan';
import { PricingTable } from '@/components/PricingTable';
import { SectionsGroup } from '@/components/SectionsGroup';

export function ClientBanner(props: IBanner) {
  return <Banner {...props} />;
}

export function ClientCta(props: ICta) {
  return <Cta {...props} />;
}

export function ClientFeature(props: IFeature) {
  return <Feature {...props} />;
}

export function ClientFooter(props: IFooter) {
  return <Footer {...props} />;
}

export function ClientHero(props: IHero) {
  return <Hero {...props} />;
}

export function ClientHubspotForm(props: IHubspotForm) {
  return <HubspotForm {...props} />;
}

export function ClientNavigation(props: INavigation) {
  return <Navigation {...props} />;
}

export function ClientPricingPlan(props: IPricingPlan) {
  return <PricingPlan {...props} />;
}

export function ClientPricingTable(props: IPricingTable) {
  return <PricingTable {...props} />;
}

export function ClientSectionsGroup(props: ISectionsGroup) {
  return <SectionsGroup {...props} />;
}
