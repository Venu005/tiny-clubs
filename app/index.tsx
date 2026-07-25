import { Text, View, ScrollView } from "react-native";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { resolveBackendConfig } from "./backendConfig";
import { getHealthDisplayState } from "./healthStatus";
import { ThreeByFourCard } from "@/components/ThreeByFourCard";
import { useTheme } from "@/theme";
import { AccessibleButton } from "@/components/AccessibleButton";
import { OnboardingAccessForm } from "@/components/OnboardingAccessForm";

type Product = {
  _id: Id<"products">;
  product: string;
  price: number;
  quantity: number;
  emoji: string;
  category: string;
};

function ProductCard({
  product,
  onPurchase,
}: {
  product: Product;
  onPurchase: () => void;
}) {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.color("surface.white"),
        borderColor: theme.color("neutral.200"),
        borderWidth: 1,
        borderRadius: theme.radius("md"),
        padding: theme.spacing("md"),
        marginBottom: theme.spacing("md"),
        ...theme.shadow("card"),
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <Text style={{ fontSize: 40, marginRight: 12 }}>{product.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              ...theme.tokens.typography.h3,
              color: theme.color("neutral.950"),
            }}
          >
            {product.product}
          </Text>
          <Text
            style={{
              ...theme.tokens.typography.bodySmall,
              color: theme.color("neutral.600"),
              marginTop: 2,
            }}
          >
            {product.category}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <View>
          <Text
            style={{
              ...theme.tokens.typography.h3,
              color: theme.color("semantic.success"),
            }}
          >
            ${product.price.toFixed(2)}
          </Text>
          <Text
            style={{
              ...theme.tokens.typography.bodySmall,
              color: theme.color("neutral.600"),
            }}
          >
            {product.quantity} in stock
          </Text>
        </View>

        <AccessibleButton
          label={product.quantity > 0 ? "Purchase" : "Out of Stock"}
          onPress={onPurchase}
          disabled={product.quantity === 0}
        />
      </View>
    </View>
  );
}

export default function Index() {
  const theme = useTheme();
  const backendConfig = resolveBackendConfig({
    APP_ENVIRONMENT_NAME: process.env.APP_ENVIRONMENT_NAME,
    EXPO_PUBLIC_APP_ENVIRONMENT: process.env.EXPO_PUBLIC_APP_ENVIRONMENT,
    EXPO_PUBLIC_CONVEX_URL: process.env.EXPO_PUBLIC_CONVEX_URL,
    EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT:
      process.env.EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT,
    EXPO_PUBLIC_CONVEX_URL_STAGING: process.env.EXPO_PUBLIC_CONVEX_URL_STAGING,
    EXPO_PUBLIC_CONVEX_URL_PRODUCTION:
      process.env.EXPO_PUBLIC_CONVEX_URL_PRODUCTION,
  });
  const health = useQuery(api.health.status);
  const products = useQuery(api.products.getProducts);
  const purchase = useMutation(api.products.purchase);
  const healthState = getHealthDisplayState(
    health,
    backendConfig.convexUrl !== null
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.color("surface.canvas") }}
      contentContainerStyle={{ padding: theme.spacing("md"), paddingTop: 60 }}
    >
      <View
        style={{
          backgroundColor:
            healthState.kind === "error"
              ? theme.color("surface.tint")
              : theme.color("surface.white"),
          borderColor:
            healthState.kind === "error"
              ? theme.color("semantic.error")
              : theme.color("brand.mint"),
          borderWidth: 1,
          borderRadius: theme.radius("md"),
          padding: theme.spacing("md"),
          marginBottom: theme.spacing("md"),
        }}
      >
        {healthState.kind === "error" ? (
          <>
            <Text
              style={{
                ...theme.tokens.typography.body,
                fontWeight: "700",
                color: theme.color("neutral.950"),
              }}
            >
              {healthState.title}
            </Text>
            <Text
              style={{
                ...theme.tokens.typography.bodySmall,
                color: theme.color("neutral.600"),
                marginTop: theme.spacing("xs"),
              }}
            >
              {healthState.message}
            </Text>
          </>
        ) : (
          <Text
            style={{
              ...theme.tokens.typography.bodySmall,
              fontWeight: "600",
              color: theme.color("neutral.950"),
            }}
          >
            {healthState.label}
          </Text>
        )}
      </View>

      <ThreeByFourCard style={{ marginBottom: theme.spacing("md") }}>
        <Text
          style={{
            ...theme.tokens.typography.caption,
            color: theme.color("brand.coral"),
            marginBottom: theme.spacing("sm"),
          }}
        >
          Weekend Madness
        </Text>
        <Text
          style={{
            ...theme.tokens.typography.h2,
            color: theme.color("neutral.950"),
          }}
        >
          Recreate a movie poster
        </Text>
        <Text
          style={{
            ...theme.tokens.typography.body,
            color: theme.color("neutral.600"),
            marginTop: theme.spacing("sm"),
          }}
        >
          A 3:4 challenge card using shared Tiny Clubs tokens.
        </Text>
      </ThreeByFourCard>

      <OnboardingAccessForm />

      {products?.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onPurchase={() => purchase({ id: product._id })}
        />
      ))}
    </ScrollView>
  );
}
