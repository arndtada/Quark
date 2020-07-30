function injectForEachMethod(method, targetType, clazz, targetName, sig, callback) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');

    var target = ASM.findFirstMethodCall(method,
        targetType,
        clazz,
        targetName,
        sig);

    while (target !== null) {
        var index = method.instructions.indexOf(target);
        var indexShift = callback(target, index);

        var newIndex = method.instructions.indexOf(target);
        if (newIndex !== -1)
            index = newIndex;
        else if (typeof indexShift === 'number')
            index += indexShift;

        target = ASM.findFirstMethodCallAfter(method,
            targetType,
            clazz,
            targetName,
            sig,
            index + 1);
    }

    return method;
}

function injectUpdateHook(method) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
    var Opcodes = Java.type('org.objectweb.asm.Opcodes');
    var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
    var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

    var newInstructions = new InsnList();

    newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
    newInstructions.add(ASM.buildMethodCall(
        "vazkii/quark/base/handler/AsmHooks",
        "updateChain",
        "(Lnet/minecraft/entity/Entity;)V",
        ASM.MethodType.STATIC
    ));
    method.instructions.insertBefore(method.instructions.getFirst(), newInstructions);

    return method;
}

function injectDropHook(clazz) {
    return function (method) {
        var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
        var Opcodes = Java.type('org.objectweb.asm.Opcodes');
        var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
        var InsnList = Java.type('org.objectweb.asm.tree.InsnList');


        return injectForEachMethod(method,
            ASM.MethodType.VIRTUAL,
            clazz,
            ASM.mapMethod("func_70106_y"), // remove
            "()V",
            function (target) {
                var newInstructions = new InsnList();


                newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                newInstructions.add(ASM.buildMethodCall(
                    "vazkii/quark/base/handler/AsmHooks",
                    "dropChain",
                    "(Lnet/minecraft/entity/Entity;)V",
                    ASM.MethodType.STATIC
                ));
                method.instructions.insertBefore(target, newInstructions);
            });
    };
}

function initializeCoreMod() {
    return {
        'generic-update-hook': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.entity.Entity',
                'methodName': 'func_70071_h_', // tick
                'methodDesc': '()V'
            },
            'transformer': injectUpdateHook
        },
        'minecart-update-hook': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.entity.item.minecart.AbstractMinecartEntity',
                'methodName': 'func_70071_h_', // tick
                'methodDesc': '()V'
            },
            'transformer': injectUpdateHook
        },
        'add-boat-drops-main': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.entity.item.BoatEntity',
                'methodName': 'func_70097_a', // attackEntityFrom
                'methodDesc': '()V' //  remove ()V
            },
            'transformer': injectDropHook('net/minecraft/entity/item/BoatEntity')
        },
        'add-boat-drops-break': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.entity.item.BoatEntity',
                'methodName': 'func_184231_a', // updateFallState
                'methodDesc': '()V'
            },
            'transformer': injectDropHook('net/minecraft/entity/item/BoatEntity')
        },
        'add-minecart-drops': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.entity.item.minecart.AbstractMinecartEntity',
                'methodName': 'func_94095_a', // killMinecart
                'methodDesc': '()V' //  remove ()V
            },
            'transformer': injectDropHook('net/minecraft/entity/item/minecart/AbstractMinecartEntity')
        },
        'add-render': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.client.renderer.entity.EntityRendererManager',
                'methodName': 'func_229084_a_', // renderEntityStatic
                'methodDesc': '(Lnet/minecraft/entity/Entity;DDDFFLcom/mojang/blaze3d/matrix/MatrixStack;Lnet/minecraft/client/renderer/IRenderTypeBuffer;I)V'
            },
            'transformer': function (method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                return injectForEachMethod(method,
                    ASM.MethodType.VIRTUAL,
                    "net/minecraft/client/renderer/entity/EntityRenderer",
                    ASM.mapMethod("func_225623_a_"), // render
                    "(Lnet/minecraft/entity/Entity;FFLcom/mojang/blaze3d/matrix/MatrixStack;Lnet/minecraft/client/renderer/IRenderTypeBuffer;I)V",
                    function (target) {
                        var newInstructions = new InsnList();

                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 13));
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 1));
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 10));
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 11));
                        newInstructions.add(new VarInsnNode(Opcodes.FLOAD, 9));

                        newInstructions.add(ASM.buildMethodCall(
                            "vazkii/quark/base/handler/AsmHooks",
                            "renderChain",
                            "(Lnet/minecraft/client/renderer/entity/EntityRenderer;Lnet/minecraft/entity/Entity;Lcom/mojang/blaze3d/matrix/MatrixStack;Lnet/minecraft/client/renderer/IRenderTypeBuffer;F)V",
                            ASM.MethodType.STATIC
                        ));

                        method.instructions.insert(target, newInstructions);
                    });
            }
        }
    }
}
