"use client";

import { useEffect, useRef, useState } from "react";
import { WineGlass, Tumbler, Jar, Vase, Candle, Plates } from "./Illustrations";
import { WHATSAPP_NUMBER, isWhatsAppConfigured } from "@/lib/whatsapp";

const STEP_MS = 3200;

const STEPS = [
  { title: "Browse", text: "Find glassware, kitchenware and decor." },
  { title: "Add to cart", text: "Tap Add to cart on anything you like." },
  { title: "Review your cart", text: "Check quantities, then add your name and address." },
  { title: "Buy Now on WhatsApp", text: "Your order opens in WhatsApp, ready to send." },
];

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1.6em" height="1.6em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h2.500l2.200 10.500a1 1 0 0 0 1 .8h8.500a1 1 0 0 0 1-.8L20 8H6.200" />
      <circle cx="9.500" cy="19.500" r="1.200" />
      <circle cx="17" cy="19.500" r="1.200" />
    </svg>
  );
}

// The phone screen. It is decorative: the step buttons next to it carry the same information.
function PhoneDemo({ step }) {
  return (
    <div className="phone-wrap" aria-hidden="true">
      <div className="phone">
        <div className="screen" data-step={step}>
          <div className="ph-status">
            <span>9:41</span>
            <span className="ph-notch" />
            <span>5G</span>
          </div>

          <div className="ph-appbar">
            <b>Ebuy</b>
            <span className="ph-cartico">
              <CartIcon />
              <span className="ph-badge">
                <span className="n1">1</span>
                <span className="n2">2</span>
              </span>
            </span>
          </div>

          {/* Steps 1 and 2: browse and add */}
          <div className="ph-view v-grid">
            <div className="ph-grid">
              <div className="ph-chips">
                <span className="on">All</span>
                <span>Glassware</span>
                <span>Decor</span>
              </div>
              <div className="ph-tiles">
                <div className="ph-tile tile-a">
                  <div className="ph-art" style={{ background: "#f6e3e8" }}><WineGlass /></div>
                  <div className="ph-name">Crystal wine glasses</div>
                  <div className="ph-price">Rs. 4,500</div>
                  <div className="ph-add"><span className="l1">Add to cart</span><span className="l2">Added ✓</span></div>
                </div>
                <div className="ph-tile">
                  <div className="ph-art" style={{ background: "#dff0f4" }}><Tumbler /></div>
                  <div className="ph-name">Everyday tumblers</div>
                  <div className="ph-price">Rs. 2,200</div>
                  <div className="ph-add"><span className="l1">Add to cart</span></div>
                </div>
                <div className="ph-tile">
                  <div className="ph-art" style={{ background: "#eef3dc" }}><Jar /></div>
                  <div className="ph-name">Glass storage jars</div>
                  <div className="ph-price">Rs. 2,900</div>
                  <div className="ph-add"><span className="l1">Add to cart</span></div>
                </div>
                <div className="ph-tile tile-d">
                  <div className="ph-art" style={{ background: "#f7ead9" }}><Vase /></div>
                  <div className="ph-name">Ceramic flower vase</div>
                  <div className="ph-price">Rs. 2,700</div>
                  <div className="ph-add"><span className="l1">Add to cart</span><span className="l2">Added ✓</span></div>
                </div>
                <div className="ph-tile">
                  <div className="ph-art" style={{ background: "#f5ecd9" }}><Candle /></div>
                  <div className="ph-name">Scented candle trio</div>
                  <div className="ph-price">Rs. 2,100</div>
                  <div className="ph-add"><span className="l1">Add to cart</span></div>
                </div>
                <div className="ph-tile">
                  <div className="ph-art" style={{ background: "#e6ecf5" }}><Plates /></div>
                  <div className="ph-name">Ceramic dinner plates</div>
                  <div className="ph-price">Rs. 3,600</div>
                  <div className="ph-add"><span className="l1">Add to cart</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: cart */}
          <div className="ph-view v-cart">
            <div className="ph-title">Your cart</div>
            <div className="ph-item">
              <div className="ph-mini" style={{ background: "#f6e3e8" }}><WineGlass /></div>
              <div><div className="ph-iname">Crystal wine glasses</div><div className="ph-qty">Qty 1</div></div>
              <div className="ph-iprice">Rs. 4,500</div>
            </div>
            <div className="ph-item">
              <div className="ph-mini" style={{ background: "#f7ead9" }}><Vase /></div>
              <div><div className="ph-iname">Ceramic flower vase</div><div className="ph-qty">Qty 1</div></div>
              <div className="ph-iprice">Rs. 2,700</div>
            </div>
            <div className="ph-total"><span>Total</span><span>Rs. 7,200</span></div>
            <div className="ph-field">Your name</div>
            <div className="ph-field">Delivery address</div>
            <div className="ph-buy">Buy Now on WhatsApp</div>
            <div className="ph-note">Payment and delivery are confirmed in the chat.</div>
          </div>

          {/* Step 4: WhatsApp */}
          <div className="ph-view v-wa">
            <div className="ph-wahead">
              <span className="ph-avatar">E</span>
              <span><b>Ebuy</b><small>online</small></span>
            </div>
            <div className="ph-chat">
              <div className="ph-bubble out">
                <div>Hello Ebuy, I&apos;d like to place an order:</div>
                <div className="gap">1. Crystal wine glasses x1 - Rs. 4,500</div>
                <div>2. Ceramic flower vase x1 - Rs. 2,700</div>
                <div className="gap"><b>Total: Rs. 7,200</b></div>
                <div className="meta">9:41 <span className="ticks">✓✓</span></div>
              </div>
              <div className="ph-bubble in">
                Thanks! We&apos;ll confirm payment and delivery here.
                <div className="meta">9:42</div>
              </div>
            </div>
            <div className="ph-input"><span>Message</span><i /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [step, setStep] = useState(0);
  const stageRef = useRef(null);

  // Restart from step 1 each time the demo scrolls into view, so nobody joins halfway.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    let wasVisible = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasVisible) setStep(0);
        wasVisible = entry.isIntersecting;
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Advance automatically, unless the visitor prefers reduced motion.
  // Choosing a step resets the timer because `step` is a dependency.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <section className="hero2">
      <div className="hero2-left">
        <h1 className="hero2-h">Glassware and homeware, delivered to your door.</h1>
        <div className="hero2-rest">
          <p className="hero2-lead">
            Pick what you like, add it to your cart, and send your order to us on WhatsApp. We confirm
            payment and delivery in the chat.
          </p>
          <div className="hero2-cta">
            <a href="#products" className="btn">Shop products</a>
            {isWhatsAppConfigured() && (
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener" className="btn btn-outline">
                Chat with us on WhatsApp
              </a>
            )}
          </div>
        </div>

        <ol className="steps" aria-label="How ordering works">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                className="step"
                aria-current={i === step ? "step" : undefined}
                onClick={() => setStep(i)}
              >
                <span className="num">{i + 1}</span>
                <span className="body">
                  <span className="t">{s.title}</span>
                  <span className="dwrap"><span className="d">{s.text}</span></span>
                  <span className="bar"><i key={step} /></span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="stage" data-step={step} ref={stageRef}>
        <div className="pill-live"><i />See how ordering works</div>
        <div className="fc fc-add">✓ 2 items added to cart</div>
        <div className="fc fc-total">Total: Rs. 7,200</div>
        <div className="fc fc-sent">✓ Order sent on WhatsApp</div>
        <svg className="still" viewBox="0 0 460 460" aria-hidden="true">
          <circle cx="230" cy="230" r="230" fill="#f3e5bd" />
          <ellipse cx="100" cy="378" rx="48" ry="7" fill="#1a1710" opacity=".12" />
          <ellipse cx="184" cy="372" rx="44" ry="7" fill="#1a1710" opacity=".12" />
          <Vase x="56" y="253" width="88" height="123" />
          <WineGlass x="138" y="262" width="90" height="108" />
        </svg>
        <PhoneDemo step={step} />
      </div>
    </section>
  );
}