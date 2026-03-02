# Network Segmentation & Troubleshooting Lab

**Updated:** Mar 2026  
**Category:** Network Engineering Lab  
**Environment:** Physical home lab (mixed enterprise & SMB hardware)

---

## Executive Overview

This project is a living, policy-driven network lab built on physical hardware to simulate real-world segmentation, trust boundaries, and operational troubleshooting.

Originally created as a fault-diagnosis environment, the lab evolved into a structured multi-VLAN architecture with centralised routing authority and deliberate Layer 2 / Layer 3 separation.

The objective is not theoretical configuration — but applied network engineering under realistic constraints.

---

## Engineering Intent

This lab was designed to demonstrate the ability to:

- Architect segmented networks intentionally
- Centralise policy enforcement
- Maintain strict Layer 2 vs Layer 3 responsibility boundaries
- Validate behaviour using real application traffic (DNS, HTTP/HTTPS)
- Introduce and diagnose controlled failure scenarios
- Refine design incrementally without disrupting core connectivity

It balances experimentation with day-to-day home usability — mirroring operational environments where stability and change must coexist.

---

## Current Architecture

High-Level Flow:

WAN (Virgin Hub – Modem Mode)  
↓  
OpenWrt (NAT + Firewall + DHCP + DNS + Inter-VLAN Routing)  
↓ 802.1Q trunk (VLANs 10 / 20 / 30 / 99)  
Zyxel GS1920-24 (Layer 2)  
↓ 802.1Q trunk  
Cisco SG300-28 (Layer 2)  
↓  
Access ports & trunked APs

Routing authority is fully centralised on OpenWrt.  
Both switches operate strictly at Layer 2 to preserve architectural clarity.

---

## VLAN & Policy Model

| VLAN | Purpose | Behaviour |
|------|---------|-----------|
| 10 – Trusted | Primary LAN | Can access VLAN 20 and VLAN 99 (administrative) |
| 20 – IoT | Restricted devices | Cannot initiate toward VLAN 10 or VLAN 99 |
| 30 – Guest | Visitor network | Internet only |
| 99 – Management | Infrastructure | Administrative plane (progressively hardened) |

### Enforcement Principles

- Asymmetric trust model (Trusted can initiate; restricted VLANs cannot)
- All inter-VLAN policy enforced at Layer 3
- No routing performed on switches
- NAT handled centrally

This mirrors common enterprise segmentation patterns while remaining operational in a home environment.

---

## Wireless Integration

- Cisco WLC 2504 in VLAN 99
- Cisco 2602i and 3802i APs trunked to switches
- SSIDs mapped directly to VLANs 10 / 20 / 30
- Wired and wireless clients subject to identical policy enforcement

Segmentation is preserved end-to-end — no wireless exemptions.

---

## Representative Failure Scenarios

### 1. Router Has Internet, LAN Does Not
**Cause:** Misconfigured NAT / forwarding rule  
**Resolution:** Validated firewall zone direction and masquerading behaviour  

**Lesson:** WAN link success does not validate forwarding logic.

---

### 2. VLAN Tagging Fault
**Cause:** Incorrect trunk tagging / PVID mismatch  
**Resolution:** Verified port membership, trunk configuration, and real application traffic  

**Lesson:** ICMP success is insufficient; validate with application-layer traffic.

---

### 3. Management Plane Access Design

Management VLAN (99) is reachable from the trusted network for administrative practicality.

Hardening is being progressively introduced to move toward host-based, least-privilege access rather than broad VLAN-level reachability.

**Lesson:** Isolation is a design decision — not an assumption.

---

## Troubleshooting Methodology

Fault isolation follows a structured sequence:

1. Physical link validation  
2. VLAN tagging verification  
3. IP addressing and gateway confirmation  
4. Firewall rule directionality  
5. NAT / masquerade validation  
6. Real application-layer traffic testing  

This approach prevents symptom chasing and accelerates root-cause identification.

---

## Design Tradeoffs

- Routing centralised for clarity and policy consistency  
- Switches intentionally restricted to Layer 2  
- Mixed hardware retained to maximise learning value  
- Stability balanced with experimentation  
- Management hardening implemented incrementally  

Older hardware is deliberately retained where viable to explore real-world constraints rather than replacing equipment prematurely.

---

## Why This Project Matters

This lab demonstrates practical network engineering capability:

- Designing and enforcing segmented architectures  
- Applying asymmetric trust models  
- Understanding NAT and firewall interaction  
- Integrating wireless infrastructure into segmented networks  
- Diagnosing multi-layer faults methodically  
- Iterating architecture safely over time  

It reflects applied problem-solving under operational constraints — not just configuration familiarity.

---

## Status

Active and evolving.

Future focus areas include:

- Further least-privilege management hardening  
- Wireless optimisation testing  
- Expanded policy complexity  
- Monitoring and visibility integration  

The lab continues to evolve through controlled experimentation and documented iteration.
