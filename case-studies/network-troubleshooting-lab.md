# Network Segmentation & Troubleshooting Lab

> **Updated:** Feb 2026<br />
> **Category:** Network Engineering Lab<br />
> **Tech:** OpenWrt (BT HH5A), Cisco SG300-28, Zyxel GS1920-24, Cisco WLC 2504, Cisco 2602i / 3802i APs, VLAN segmentation, firewall policy design

---

## Overview

This is a living network engineering lab built on physical hardware.
It began as a troubleshooting environment and has evolved into a segmented, policy-driven multi-VLAN architecture focused on controlled trust boundaries, routing centralisation, and deliberate isolation.

The lab intentionally surfaces realistic failure modes:

- VLAN misconfiguration
- Trunk tagging errors
- Management plane isolation
- NAT and masquerade behaviour
- Firewall rule directionality
- Inter-VLAN policy enforcement

All validation is performed using real client traffic (DNS, HTTP/HTTPS), not just ICMP.

---

## Current Segmented Topology
<div align="center">

<img src="../assets/images/network-lab-topology_techdark.svg"
     alt="Network Lab Topology – Multi-VLAN Segmented Design"
     width="1000" />

</div>
> See topology diagram above for port-level and trunk detail.

High-level flow:

WAN (Virgin Hub modem)
↓
OpenWrt (NAT + Firewall + DHCP + DNS)
↓ 802.1Q trunk (VLANs 10/20/30/99)
Zyxel GS1920-24 (Layer 2 switching)
↓ 802.1Q trunk
Cisco SG300-28 (Layer 2 switching)
↓
Access ports & trunked APs (from both Zyxel and SG300)

Routing authority remains centralised on OpenWrt.
Both switches operate at Layer 2 only.

---

## VLAN & Policy Design

| VLAN | Name        | Purpose            | Policy Behaviour |
|------|------------|-------------------|------------------|
| 10   | Trusted     | Primary LAN        | Can reach VLAN 20 & 99 |
| 20   | IoT         | Restricted LAN     | Cannot initiate to VLAN 10 or 99 |
| 30   | Guest       | Fully isolated     | Internet only |
| 99   | Management  | Infrastructure     | No initiation toward user VLANs |

### Policy Summary

- VLAN 10 → VLAN 20: Allowed
- VLAN 20 → VLAN 10: Blocked
- VLAN 99 → User VLANs: Blocked
- VLAN 30 → All internal VLANs: Blocked
- All VLANs → WAN: NAT via OpenWrt

Trust model:

- VLAN 10 (Trusted) has controlled access to VLAN 20 and VLAN 99.
- VLAN 20 (IoT) and VLAN 99 (Management) cannot initiate toward user VLANs.
- VLAN 30 (Guest) is fully isolated (internet only).

---

## Layer 2 Architecture

Both the Zyxel GS1920-24 and Cisco SG300-28 operate strictly as Layer 2 switches.

- 802.1Q trunk from OpenWrt to Zyxel
- 802.1Q trunk from Zyxel to SG300
- Trunked AP connections on both switches
- Access ports assigned per VLAN
- No inter-VLAN routing on switches (by design)

This ensures switching and routing responsibilities remain clearly separated.

---

## Layer 3 Architecture (OpenWrt)

OpenWrt is the single Layer 3 authority in the lab.

Responsibilities:

- Inter-VLAN routing
- NAT (WAN masquerading)
- Firewall policy enforcement
- DHCP/DNS services

Key principle:

Switching ≠ Routing.
All routing decisions and security policy enforcement are centralised intentionally.

---

## Wireless Integration

- Cisco WLC 2504 in VLAN 99 (Management)
- APs trunked from both Zyxel and SG300
- SSIDs mapped to VLANs 10, 20, 30
- Segmentation preserved across wired and wireless clients

Wireless segmentation mirrors wired VLAN boundaries — no special exemptions.

---

## Real Incidents & Lessons Learned

### Router Has Internet, LAN Does Not

Root cause: Misconfigured LAN → WAN forwarding / masquerading.

Lesson: Validate NAT and forwarding rules, not just WAN connectivity.

---

### Management VLAN Isolation

Placing management interfaces in VLAN 99 prevented access from default VLANs by design.

Lesson: Isolation is expected behaviour; management access must be deliberate.

---

### VLAN Isolation Validation

Isolation validated using:

- Cross-VLAN ping tests
- DNS resolution checks
- HTTP/HTTPS traffic tests
- Trunk verification on switch ports

Traffic validation is more meaningful than ICMP alone.

---

## Troubleshooting Framework

1. Physical link status
2. VLAN tagging correctness
3. IP addressing and gateway validation
4. Firewall rule directionality
5. NAT / masquerade behaviour
6. Real traffic validation

This structured approach prevents chasing symptoms.

---

## Design Tradeoffs

- SG300 kept Layer 2-only for routing clarity
- OpenWrt centralised for policy simplicity
- Management plane deliberately isolated
- Dual-switch design retained for comparative testing and platform familiarity

---

## Why This Lab Matters

This environment is intentionally designed as a living lab.
Changes are implemented incrementally, tested against real traffic, and documented when failure occurs.

The objective is not just connectivity — but controlled connectivity.

---

## Summary

This lab demonstrates applied network engineering rather than theoretical configuration.

It reflects practical understanding of:

- Multi-VLAN segmented design
- Controlled trust boundaries
- Centralised firewall enforcement
- Wireless + wired policy consistency
- NAT behaviour and forwarding logic
- Layer 2 vs Layer 3 responsibility
- Management plane isolation

Segmentation is enforced, tested, and validated using real client traffic.
