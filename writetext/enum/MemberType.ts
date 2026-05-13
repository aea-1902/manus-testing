export const enum MemberTypeEnum {
    FREE = 0,
    PREPAID = 1,
    SUBSCRIBER = 2,
    FREETRIAL = 3,
    STARTER = 4,
    PROFESSIONAL = 5,
    ENTERPRISE = 6
}

export const enum SubscriptionStatusEnum{
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED', 
    EXPIRED = 'EXPIRED',
    PROCESSING = 'PROCESSING'
}

export const enum SubscriptionTypeEnum{
    PREPAID = 0,
    MONTHLY = 1,
    ANNUAL = 2

}

export const enum GateWayTypeEnum{
    PAYPAL = "PAYPAL",
    SHOPIFY = "SHOPIFY",
    PADDLE = "PADDLE"
}