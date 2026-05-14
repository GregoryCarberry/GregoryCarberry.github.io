# Network Segmentation & Troubleshooting Lab

**Updated:** May 2026  
**Category:** Network engineering, segmentation, monitoring and troubleshooting lab  
**Environment:** Physical home lab using mixed enterprise, SMB and repurposed hardware

---

## Executive Overview

This project is a living network engineering lab built around a real home network rather than a simulated-only topology.

The lab has now moved beyond the original OpenWrt-based design. The current baseline uses an HP t730 thin client running OPNsense as the primary router/firewall, with dedicated VLANs, controller-based Cisco wireless, a managed switching layer, DNS filtering, and lightweight monitoring.

The aim is practical: build, break, observe and troubleshoot a segmented network while keeping it usable enough for day-to-day home connectivity.

---

## Current Architecture

High-level flow:

```text
Virgin Hub in modem mode
        ↓
HP t730 running OPNsense
        ↓
Zyxel GS1920-24v1 access switch
        ↓
Cisco SG300 switch / Cisco WLC / wired clients / APs
        ↓
Trusted, IoT, Guest and Management networks
```

OPNsense is now the central Layer 3 authority for:

- WAN connectivity
- NAT
- DHCP
- DNS forwarding / resolver integration
- Inter-VLAN routing
- Firewall policy enforcement

The switches remain Layer 2 only. That separation is deliberate: routing and policy decisions belong on the firewall, while the switches provide VLAN transport and access-layer connectivity.

---

## VLAN & Policy Model

| VLAN | Subnet | Purpose | Behaviour |
|------|--------|---------|-----------|
| 10 | `10.10.10.0/24` | Trusted | Primary user devices and trusted admin access |
| 20 | `10.10.20.0/24` | IoT | Restricted smart devices and media devices |
| 30 | `10.10.30.0/24` | Guest | Internet-only guest access |
| 99 | `10.10.99.0/24` | Management | Network infrastructure management |
| 999 | No normal client subnet | Parking / isolation | Unused or untrusted switch ports |

The current policy model is asymmetric:

- Trusted devices can initiate to selected infrastructure and IoT services.
- IoT devices cannot freely initiate back into Trusted.
- Guest is isolated from internal networks.
- Management is reachable only where operationally required and is planned for further hardening.
- VLAN 999 is used to avoid leaving unused ports in a useful production VLAN.

This is not just “VLANs exist”. The important part is that routing behaviour, firewall rules, DNS behaviour and real client traffic are validated together.

---

## Wireless Integration

Wireless is provided by a Cisco 2504 WLC and Cisco Aironet APs.

Current SSID-to-VLAN mapping:

| SSID Type | VLAN |
|-----------|------|
| Trusted Wi-Fi | VLAN 10 |
| IoT Wi-Fi | VLAN 20 |
| Guest Wi-Fi | VLAN 30 |

The wireless side follows the same trust model as the wired network. A phone on Trusted Wi-Fi, for example, can be used to initiate controlled access to IoT/media devices without giving the IoT network broad access back into the Trusted network.

This has been tested with real devices, including Chromecast-style discovery and media playback workflows.

---

## Monitoring and Services Host

A repurposed Lenovo Yoga laptop now acts as a lightweight Debian server on the Trusted VLAN.

Current and planned service role:

- Pi-hole for DNS filtering and query visibility
- Grafana dashboards
- Prometheus/exporter-style monitoring
- Node and service metrics
- Future expansion into more lab observability

This changed the lab from pure connectivity testing into a more operational environment. DNS behaviour, client activity and service health can now be inspected rather than guessed.

---

## Representative Troubleshooting Scenarios

### 1. DHCP or Addressing Failure

A client lands on the wrong subnet, fails to obtain a lease, or receives a gateway/DNS combination that does not match the intended VLAN.

Troubleshooting path:

1. Confirm switch port VLAN membership.
2. Confirm trunk tagging.
3. Confirm OPNsense interface assignment.
4. Confirm DHCP scope.
5. Confirm client lease details.

### 2. DNS Filtering and Client Visibility

Pi-hole provides visibility into what clients are querying and what is being blocked.

This is useful for validating:

- Whether clients are using the intended DNS path
- Whether IoT devices still function with tracking/telemetry domains blocked
- Whether DNS failures are policy-related or connectivity-related

### 3. Inter-VLAN Firewall Behaviour

The lab validates that “can reach the internet” does not mean “can reach everything”.

Example checks include:

- Trusted to IoT access where needed
- IoT blocked from initiating to Trusted
- Guest isolated from internal services
- DNS allowed while ICMP or other protocols may be blocked

### 4. Chromecast / Media Discovery Across VLANs

Media casting exposed a realistic home-lab problem: discovery and control traffic may behave differently from direct client/server traffic.

Rather than flattening the network, the lab uses selective rules and validation to allow required media workflows while preserving IoT segregation.

### 5. Monitoring Host Stability

The Debian monitoring host is repurposed laptop hardware, so operational issues such as lid-close behaviour, sleep states and service persistence had to be handled.

This reflects a common real-world constraint: not every useful system starts life as perfect server hardware.

---

## Troubleshooting Methodology

The working method is intentionally structured:

1. Confirm physical link and power.
2. Confirm switch port mode and VLAN membership.
3. Confirm trunk tagging and native/PVID expectations.
4. Confirm IP addressing, gateway and DNS.
5. Confirm OPNsense interface and DHCP state.
6. Confirm firewall rule order and direction.
7. Confirm real application behaviour.
8. Check logs and metrics before guessing.

This avoids the trap of changing multiple things at once and then not knowing which change fixed the issue.

---

## Design Tradeoffs

This lab deliberately keeps some imperfect or older hardware because that creates useful engineering constraints.

Examples:

- Cisco SG300 is not Cisco IOS and must be handled with its own syntax.
- The Cisco 2504 WLC and Aironet APs are older but still useful for controller-based wireless learning.
- The Lenovo Yoga is not ideal server hardware but works well as a lightweight monitoring node after tuning.
- The Buffalo NAS remains useful for storage while future media-server options are evaluated.
- IoT usability has to be balanced against security isolation.

The result is more valuable than a “perfect” greenfield design because it forces practical operational decisions.

---

## Why This Project Matters

This project demonstrates:

- Practical VLAN design
- OPNsense firewall and routing administration
- Layer 2 vs Layer 3 responsibility separation
- Real Wi-Fi controller integration
- DNS filtering and client visibility
- Monitoring and operational observability
- Cross-VLAN troubleshooting
- Incremental change management
- Documentation of real design tradeoffs

For support, cloud, networking or junior infrastructure roles, this is strong evidence because it shows the full loop: design, implementation, validation, troubleshooting and documentation.

---

## Current Status

Active and evolving.

Recent progress includes:

- Migration from OpenWrt/Home Hub routing to OPNsense on an HP t730
- Reworked VLAN/firewall baseline
- Pi-hole deployment
- Grafana monitoring
- Chromecast/media cross-VLAN testing
- Documentation refresh to align the repo with the current architecture

Next likely improvements:

- More Grafana/Prometheus dashboards
- Management VLAN hardening
- More polished network diagrams
- Further media-server testing
- Better long-term documentation of firewall rules and validation tests
