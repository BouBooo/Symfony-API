<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;

/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 * @ApiResource(
 *  subresourceOperations={
 *      "api_customers_invoices_get_subresource" = {
 *          "normalization_context" = {
 *              "groups" = "invoices_subresource" 
 *          }
 *       }
 *  },
 *  collectionOperations={
 *      "GET", 
 *      "POST"
 *  },
 *  itemOperations={
 *      "GET",
 *      "PUT",
 *      "DELETE",
 *      "increment" = {
 *          "method" = "post",
 *          "path"  = "/invoices/{id}/increment",
 *          "controller" = "App\Controller\InvoiceIncrementationController",
 *          "swagger_context" = {
 *              "summary" = "Incrémente une facture",
 *              "description" = "Incrémente le chrono d'une facture"    
 *          }
 *      }
 *  },
 *  attributes={
 *      "pagination_enabled"=false,
 *      "pagination_items_per_page"=10,
 *      "order": { "amount" : "desc" }
 *  },
 *  normalizationContext={
 *      "groups" = {"invoices_read"}
 *  },
 *  denormalizationContext={
 *      "disable_type_enforcement" = true
 *  }
 * )
 * @ApiFilter(OrderFilter::class, properties={"amount", "sendAt"})
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le montant de la facture est obligatoire")
     * @Assert\Type(type="numeric", message="Le montant de la facture doit être un numérique")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\DateTime(message="La date doit être au format YYYY-MM-DD")
     * @Assert\NotBlank(message="La date d'envoi de la facture est obligatoire")
     */
    private $sendAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le statut de la facture est obligatoire")
     * @Assert\Choice(choices={ "SENT", "PAID", "CANCELED" }, message="Le statut doit être SEND, PAID ou CANCELED")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="Le client de la facture est obligatoire")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le chrono de la facture est obligatoire")
     * @Assert\Type(type="integer", message="Le chrono doit être un nombre")
     */
    private $chrono;


    /**
     * Récupérer l'utilisateur
     * @Groups({"invoices_read", "invoices_subresource"})
     *
     * @return User
     */
    public function getUser():User {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSendAt(): ?\DateTimeInterface
    {
        return $this->sendAt;
    }

    public function setSendAt($sendAt): self
    {
        $this->sendAt = $sendAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
