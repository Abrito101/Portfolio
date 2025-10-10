With this mini PC I was planning on using PFsense or Opensense. PF sense is more of a stable and reliable firewall. However Opensense is an opensource OS and their UI is user friendly, also I am interested in their VPN, monitoring and logging features that is advertised. So I will be using open sense to start this router configuration. 






# Opensense Configuration 

My first step is to download opensense on a bootable flashdrive.

https://opnsense.org/download/#full-mirror-listing

using this link I can download opensense on my flash drive 

![[Pasted image 20251006142621.png]]

And we need to make sure we flash it using balenaEtcher so that it can be viewed by the BIOS as a bootable drive 

![[Pasted image 20251006142608.png]]

Then we boot that flash drive on the GMK PC and load the OS 

Once the OS is loaded we configured the Opensense OS as the installer and created our root login and password so we can connect remotely on our desktop. We do this through a LAN connection, so I needed to connect an ethernet cable going from the modem into the Router then another ethernet from the router directly into my PC. So we used 192.168.1.1 to remote into the OpenSense UI and we were propted with our username and password to enter. 

![[Pasted image 20251007080343.png]]

Here we log in as root and our password.

![[Pasted image 20251007080517.png]]

Its important that we make sure Opensense is updated to the latest version. 


# DHCP Server Setup

Now its time to configure our DHCP Server and set up some rules. 

Our first step will be to set up a host, this gives our rules a mac address to report to. We can create a host in the firewall tab under aliases. 

![[Pasted image 20251007081248.png]]
![[Pasted image 20251007081258.png]]
Here we can see our default aliases that were configured in the installation. 

![[Pasted image 20251007081528.png]]
Here we created an allias

![[Pasted image 20251007101117.png]]

Now its time to set up our DHCP server, we went into services and into ISC DHCP v4 and created our DHCP server, 

![[Pasted image 20251007203835.png]]

Here we can see that we added a range of IP addresses, the gateway and dns server ip addresses. Then we added a static IP to our router to give it its own IP address for easier functionality. 

# VLAN Setup 



Under Interfaces -> Devices -> VLAN we can add a VLAN . I made this VLAN named vlan.0.20 with the vlan tag 20. 

![[Pasted image 20251007205055.png]]

Then we add it here under assignments 

![[Pasted image 20251007205116.png]]

![[Pasted image 20251007205332.png]]

Next we configure the vlans setting making sure we enable it on the network, also addit the static ipv4 address to 192.168.20.1

![[Pasted image 20251008123200.png]]

Now its time to add this to our WLAN configuration, since we dont have a managed switch we can just configure our network segmentation through the WAP Omada TP link has a great feature where you can configure WLANS through its website. 

We need to connect our WAP and head over to settings then LAN ![[Pasted image 20251008144503.png]]

![[Pasted image 20251008144530.png]]

Then we create a new LAN 

![[Pasted image 20251008144703.png]]

And we enter our VLAN's IP address as the gateway, the vlan tag, and setup the DHCP Range under interfaces. 

![[Pasted image 20251010124918.png]]

Here we can see that the two WLANs that we made are now discoverable and able to connect. However theyre still not secure because we need to isolate our WAN and LAN from IOT Devices and still allow it to connect to the internet. So we will make rules in our firewall to cut that communication from my IOT devices to my WAN/LAN.

![[Pasted image 20251010125622.png]]

![[Pasted image 20251010125836.png]]

Here a rule is made to block access to the LAN however we make another rule to allow all access into the internet.

And that concludes our VLAN configuration. In the future I will refine this with a Guest configuration with low DHCP Lease times, and heavy firewall rules blocking access to my entire network. I might even leave it open to the public to then configure it as a honeypot. 

# VPN Setup 

For our VPN configuration we will use MullVlad and configure it using Wireguard to have it run through my whole network. So ideally all traffic will run through Mullvlad before entering and exiting my network on all devices. To start out we need to go into Mullvlad VPN and log into our account. 

![[Pasted image 20251010131136.png]]

Under account -> Wireguard Configuration we can generate a key that connects wireguard to our Opensense Wireguard instance that we will make. When you generate that key it will give you a file that contains all of the contents that you will enter into your Opensense Wireguard instance. 

![[Pasted image 20251010131535.png]]

When you generate your key you can choose the server in which you can host from. Then you download the configuration file. 

![[Pasted image 20251010131820.png]]

Here we have our instance and our peer settings. 

![[Pasted image 20251010131907.png]]

On opensense under VPN -> Wireguard -> instances -> You click the plus button on the bottom right and add a new instance you add the information given to you by mullvlad. 

![[Pasted image 20251010132222.png]]

We will leave the peers as is now then come back and add them once we configure our peers. 

Under Wireguard -> Peers we click the + symbol and add the information given to us by wireguard. 

![[Pasted image 20251010133320.png]]

Here we entered everything under the Peer section in our configuration file. 

Then we create an interface just how we did for our LAN and WAN to create rules, and add it to our network. 

![[Pasted image 20251010134817.png]]

Under instances and assignments you should see a wireguard device and add it to your interfaces. Onces its added you can go into the interface and enable it. 

Then we have to make a gateway under System ->Gateways- Configuration to route our traffic out to the internet. 

![[Pasted image 20251010140100.png]]

Now we need to configure our NAT rules to allow our VPN to rout traffic through our network without getting interrupted.

Under Firewall -> NAT -> Outbound we want to change the mode into hybrid and create manual rules to allow all traffic through our WAN, LAN, and our VLAN.  

and it should look like this 

![[Pasted image 20251010140502.png]]

And that concludes our VLAN configuration we get a confirmation on a mullvlad connection check 

![[Pasted image 20251010143351.png]]

And we can see that Mullvlad is masking our IP address, this is the ip address displayed to the internet,

![[Pasted image 20251010143504.png]] 


And this is my actual static IP I set on opensense 

![[Pasted image 20251010143617.png]]