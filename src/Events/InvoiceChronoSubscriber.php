<?php

namespace App\Events;

use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;

class InvoiceChronoSubscriber implements EventSubscriberInterface {
    
    private $security;
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository) {
        $this->security = $security;
        $this->repository = $repository;
    }

    public static function getSubscribedEvents() {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(GetResponseForControllerResultEvent $event) {
        $user = $this->security->getUser();
        $method = $event->getRequest()->getMethod();
        $invoice = $event->getControllerResult();

        if($invoice instanceof Invoice && $method === "POST") {
            $nextChrono = $this->repository->findNextChrono($this->security->getUser());
            $invoice->setChrono($nextChrono);

            if(empty($invoice->getSendAt())) {
                $invoice->setSendAt(new \DateTime);
            }
        }
    }
}